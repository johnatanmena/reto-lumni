import { api } from "./config";
import IApiErrorDto from "@presentation/controllersModels/IApiErrorDto";
import { useMemo } from "react";
import useSWR from "swr";
import IPersonDto from "@application/models/IPersonDto";

export interface IuseFetchStudent {

}

export default function useFetchStudent(props?: IuseFetchStudent) {
  const searchKey = useMemo(() => `job-offers`, []);

  const { data, error, isValidating, mutate } = useSWR<IPersonDto[], IApiErrorDto, string>(
    searchKey,
    (key: string) => api.get(key).then(x => x.isSuccess ? x.body : Promise.reject(x.body)),
  );

  return {
    student: data,
    refreshJobOffers: mutate,
    loadingStudent: isValidating && (data === undefined),
    validatingJobOffers: isValidating,
    fetchingJobOffersError: error,
  };
}
