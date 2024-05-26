import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository } from "typeorm";
import * as bcryptjs from "bcryptjs";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByEmailWithPassword(createUserDto.email);

    if (user) {
      throw new BadRequestException("El usuario ya existe");
    }

    const password = await bcryptjs.hash(createUserDto.password, 10);
    return this.userRepository.save({ ...createUserDto, password });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
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
