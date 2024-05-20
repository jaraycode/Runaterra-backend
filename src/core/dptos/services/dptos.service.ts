import { Injectable } from "@nestjs/common";
import { CreateDptoDto } from "../dto/create-dpto.dto";
import { UpdateDptoDto } from "../dto/update-dpto.dto";

@Injectable()
export class DptosService {
  create(createDptoDto: CreateDptoDto) {
    return "This action adds a new dpto";
  }

  findAll() {
    return `This action returns all dptos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dpto`;
  }

  update(id: number, updateDptoDto: UpdateDptoDto) {
    return `This action updates a #${id} dpto`;
  }

  remove(id: number) {
    return `This action removes a #${id} dpto`;
  }
}
