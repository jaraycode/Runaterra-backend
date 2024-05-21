import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { CreateDptoDto } from "./dto/create-dpto.dto";
import { UpdateDptoDto } from "./dto/update-dpto.dto";

@Controller("dptos")
export class DptosController {
  constructor(private readonly dptosService: DptosService) {}

  @Post()
  create(@Body() createDptoDto: CreateDptoDto) {
    return this.dptosService.create(createDptoDto);
  }

  @Get()
  findAll() {
    return this.dptosService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dptosService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDptoDto: UpdateDptoDto) {
    return this.dptosService.update(+id, updateDptoDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dptosService.remove(+id);
  }
}
