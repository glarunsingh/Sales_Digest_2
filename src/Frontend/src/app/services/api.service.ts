import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { environment } from 'src/environments/environment';

interface apiResponse {
  message: string;
  data: any
  status: string,
  success: string | boolean
}


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public api_url: string = environment.api_url;

  constructor(private http: HttpClient, public commonService: CommonService) { }

  //Authorization: Bearer token
  // createAuthorizationHeader(): HttpHeaders {
  //   return new HttpHeaders({
  //     'Authorization': 'Bearer ' + '' + atob(this.commonService.getStorageItems('raw')),
  //     'Content-Type': 'application/json'
  //   })
  // }


  getInitialRoles(): Observable<apiResponse> {
    return this.http.get<apiResponse>(this.api_url + "onboarding/init")
  }

  getDrugChannelData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "fetch_dc_data", payload)
  }

  downloadDrugChannelData(timeStampsList: any): Observable<Blob> {
    return this.http.post(this.api_url + "main_app/download_excel", timeStampsList, {responseType: 'blob' })
  }

  getDepartmentList(): Observable<apiResponse> {
    return this.http.get<apiResponse>(this.api_url + "onboarding/get_departments")
  }

  getClientNamesList(args: string) {
    return this.http.get(this.api_url + "onboarding/get_clients_name/" + '' + args)
  }

  sendUserOnBoardinDetails(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "onboarding/user_details", payload)
  }

  getClientNewsClientList(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/fetch_client", payload)
  }

  getDeinitiveClienList(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/fetch_definitive_client", payload)
  }

  getBreakingNews(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/breaking_news", payload)
  }

  getClientNewsUpdateData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/source_data", payload)
  }

  downloadClientNewsData(payload: any): Observable<Blob> {
    return this.http.post(this.api_url + "main_app/download_excel", payload, {responseType: 'blob' })
  }

  downloadDefinitiveData(payload: any): Observable<Blob> {
    return this.http.post(this.api_url + "main_app/download_definitive_excel", payload, {responseType: 'blob' })
  }

  getDeinitiveChannelData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/definitive_data", payload)
  }

  fetchnonAdminClientListData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/fetch_client_non_admin_manage", payload)
  }

  saveUnsaveNonAdminFavClients(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "onboarding/non_admin_save_fav_client", payload)
  }

  fetchAdminClientListData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/fetch_admin_client", payload)
  }

  saveAdminClientListData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "onboarding/admin_save_client_modification", payload)
  }

  deleteAdminClientRow(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "onboarding/delete_client_admin", payload)
  }

  fetchAdminKeywordListData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "main_app/fetch_admin_keywords", payload)
  }

  saveAdminKeywordListData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "onboarding/admin_save_keywords_modification", payload)
  }

  deleteAdminKeywordRow(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "onboarding/delete_keywords_admin", payload)
  }

  updateFeedback(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "feedback/update_user_feedback", payload)
  }

  fetchKeywords(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "keyword_digest/fetch_keywords", payload)
  }

  getKeywordSearchData(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "keyword_digest/get_search_data", payload)
  }

  getKeywordSummary(payload: any): Observable<apiResponse> {
    return this.http.post<apiResponse>(this.api_url + "keyword_digest/get_keyword_summary", payload)
  }

  downloadKeyworsDigestData(payload: any): Observable<Blob> {
    return this.http.post(this.api_url + "keyword_digest/download_searched_news_excel", payload, {responseType: 'blob' })
  }

  getUserProfileDetails(cbs: any, cbe: any) {
    this.http.get("https://graph.microsoft.com/v1.0/me").subscribe((response) => {
      cbs(response);
    }, (error: HttpErrorResponse) => {
      cbe(error['name'] + ' : ' + error['statusText'])
    })
  }

}
