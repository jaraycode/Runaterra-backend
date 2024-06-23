import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateDptoDto } from "../dto/create-dpto.dto";
import { UpdateDptoDto } from "../dto/update-dpto.dto";
import { Dpto } from "../entities/dpto.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { PageOptionsDto } from "@src/common/dto/pageOptions.dto";
import { PageDto } from "@src/common/dto/page.dto";
import { PageMetaDto } from "@src/common/dto/page.meta.dto";
import { Category } from "@src/core/categories/entities/category.entity";
import { Contribution } from "@src/core/contributions/entities/contribution.entity";

@Injectable()
export class DptosService {
  constructor(
    @InjectRepository(Dpto)
    private readonly dptoRepository: Repository<Dpto>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Contribution)
    private readonly contributionRepository: Repository<Contribution>,
  ) {}

  async create(createDptoDto: CreateDptoDto): Promise<Dpto> {
    const newDpto = new Dpto();
    const { categoriesIDs, name } = createDptoDto;
    const categories = await this.categoriesRepository.find({
      where: {
        id: In(createDptoDto.categoriesIDs),
      },
    });

    if (!categories) {
      throw new BadRequestException("Alguna de las categorias ingresadas no existe");
    }

    newDpto.name = name;
    newDpto.categories = categories;

    return await this.dptoRepository.save(newDpto);
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<Dpto>> {
    const [result, total] = await this.dptoRepository.findAndCount({
      order: {
        name: pageOptionsDto.order,
      },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      relations: ["user"],
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });

    return new PageDto(result, pageMetaDto);
  }

  async findAllWithoutPagination(): Promise<Dpto[]> {
    return await this.dptoRepository.find({ relations: ["user", "categories"] });
  }

  async getMatrix(id: number) {
    const department = await this.dptoRepository.findOne({ where: { id: id }, relations: ["user", "categories"] });

    if (!department) {
      throw new NotFoundException("Departamento no encontrado");
    }

    const allCategories = await this.categoriesRepository.find(); // ! Need to filter all categories that are inside department

    // ! Using filtered categories search for the quantity of the contributions
    // TODO: function to quantify contributions for that user

    const filteredCategories = await this.potencialCategories(allCategories, department);

    const matrix = {
      departmentName: department.name,
      categories: filteredCategories,
    };

    return matrix;
  }

  // ! Falta probarla, se puede mejorar eficiencia
  async potencialCategories(categories: Category[], dpto: Dpto) {
    const userContributions = await this.contributionRepository.find({
      where: { user: dpto.user },
      relations: ["category"],
    });
    let potencial = [];
    for (let c of categories) {
      let quantity = 0;
      let potencially = false;
      userContributions.every((element) => {
        if (element.category.id === c.id) quantity++;
      });
      for (let cp of dpto.categories) {
        if (cp.id === c.id) potencially = true;
      }
      potencial.push({ id: c.id, potencially: potencially, quantity: quantity });
    }

    return potencial;
  }

  async findOne(id: number): Promise<Dpto> {
    return await this.dptoRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDptoDto: UpdateDptoDto): Promise<Dpto> {
    try {
      const { categoriesIDs, name } = updateDptoDto;

      const department = await this.findOne(id);

      if (!department) {
        throw new NotFoundException("Departamento no encontrado");
      }

      const newCategories = await this.categoriesRepository.find({ where: { id: In(categoriesIDs) } });

      for (let c of newCategories) department.categories.push(c);

      department.name = name;
      department.categories = department.categories.filter((c) => categoriesIDs.includes(c.id));

      await this.dptoRepository.save(department);

      const resultado = await this.dptoRepository.update(id, department);

      if (resultado.affected === 0) {
        throw new NotFoundException("La actualización del departamento no se pudo realizar");
      }

      return await this.findOne(id);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    const department = await this.findOne(id);

    if (!department) {
      throw new NotFoundException("Departamento no encontrado");
    }

    const resultado = await this.dptoRepository.softDelete(id);

    if (resultado.affected === 0) {
      throw new NotFoundException("La eliminación del departamento no se pudo realizar");
    }

    return;
  }
}
