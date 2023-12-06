import { singleton } from "tsyringe";
import JobOffersRepository from "@domain/repository/JobOffersRepository";
import PersonsRepository from "@domain/repository/PersonsRepository";
import IAuthorizationDataDto from "./models/IAuthorizationDataDto";
import { UnauthorizedException } from "@storyofams/next-api-decorators";
import UserRole from "@domain/models/UserRole";
import JobOfferDtoMapper from "./mappers/JobOfferDtoMapper";
import PersonDtoMapper from "./mappers/PersonDtoMapper";
import IJobOfferDto from "./models/IJobOfferDto";
import IPersonDto from "./models/IPersonDto";

@singleton()
export default class AdminGetJobOfferData {

  constructor(
    private jobOfferDtoMapper: JobOfferDtoMapper,
    private jobOffersRepository: JobOffersRepository,
    private PersonsRepository: PersonsRepository,
    private PersonDtoMapper: PersonDtoMapper,
  ) { }

  async getJobOfferById(id: string, authInfo?: IAuthorizationDataDto): Promise<IJobOfferDto | null> {

    if (authInfo === undefined || !authInfo.roles.includes(UserRole.Staff)) {
      throw new UnauthorizedException("Allowed for Staff Only");
    }

    const entity = await this.jobOffersRepository.fetchById(id);
    if (!entity)
      return null;
    return this.jobOfferDtoMapper.entityToDto(entity);
  }

  async getAllJobOffers(authInfo?: IAuthorizationDataDto): Promise<IJobOfferDto[]> {
    if (authInfo === undefined || !authInfo.roles.includes(UserRole.Staff)) {
      throw new UnauthorizedException("Allowed for Staff Only");
    }

    const entities = await this.jobOffersRepository.fetchAll();
    return entities.map(x => this.jobOfferDtoMapper.entityToDto(x));
  }

  async getAllStudents(authInfo?: IAuthorizationDataDto): Promise<IPersonDto[]> {
    if (authInfo === undefined || !authInfo.roles.includes(UserRole.Staff)) {
      throw new UnauthorizedException("Allowed for Staff Only");
    }

    const entities = await this.PersonsRepository.fetchAllWithEmploymentInfo();
    return entities.map(x => this.PersonDtoMapper.entityToDto(x));
  }
}

