"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEvolutionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_evolution_dto_1 = require("./create-evolution.dto");
class UpdateEvolutionDto extends (0, swagger_1.PartialType)(create_evolution_dto_1.CreateEvolutionDto) {
}
exports.UpdateEvolutionDto = UpdateEvolutionDto;
//# sourceMappingURL=update-evolution.dto.js.map