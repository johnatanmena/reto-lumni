import IGenericApiResponse from "@view/common/ApiClient/IGenericApiResponse"
import { api } from "./config";
import IJobOfferDto from "@application/models/IJobOfferDto";
import IPersonDto from "@application/models/IPersonDto";


export function getAllJobOffers(): Promise<IGenericApiResponse<IJobOfferDto[]>> {
  return api.get("job-offers");
}

export function getAllStudents(): Promise<IGenericApiResponse<IPersonDto[]>> {
  return api.get("vencida");
}
