import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import * as bcryptjs from "bcryptjs";
import { PageDto } from "@src/common/dto/page.dto";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";
import { DptosService } from "@src/core/dptos/services/dptos.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dptoService: DptosService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByEmailWithPassword(createUserDto.email);

    const dpto = await this.dptoService.findOne(createUserDto.departmentId);

    const userDpto = await this.userRepository.find({
      relations: ["department"],
      where: {
        department: {
          id: dpto.id,
        },
      },
    });

    if (user) {
      throw new BadRequestException("El usuario ya existe");
    }

    if (!dpto) {
      throw new BadRequestException("El departamento no existe");
    }

    if (userDpto && userDpto.some((user) => user.role === "dpto")) {
      throw new BadRequestException("El departamento ya tiene un usuario con el rol dpto");
    }

    const password = await bcryptjs.hash(createUserDto.password, 10);

    const { departmentId, ...data } = createUserDto;

    const newUser = await this.userRepository.create({ ...data, password, department: dpto });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = await this.userRepository.createQueryBuilder("user");

    queryBuilder.leftJoinAndSelect("user.department", "department");
    queryBuilder.orderBy("user.createdAt", pageOptionsDto.order).skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const result = await this.userRepository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException("La actualización del usuario no se pudo realizar");
    }

    const updatedUser = await this.findOne(id);

    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException("Usuario no encontrado");
    }

    const result = await this.userRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException("La eliminación del usuario no se pudo realizar");
    }

    return;
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      select: ["id", "name", "email", "password", "role"],
    });
  }
}
