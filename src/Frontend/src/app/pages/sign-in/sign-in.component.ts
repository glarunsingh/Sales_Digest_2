import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [MsalService]
})
export class SignInComponent {
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  public getAllAccounts: any[] = [];

  // constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  //   private broadcastService: MsalBroadcastService, private authService: MsalService,
  //   public router: Router, private apiService: ApiService, public commonService: CommonService) {
  // }

  constructor(
    public router: Router, private apiService: ApiService, public commonService: CommonService) {
  }
  ngOnInit() {
    // this.broadcastService.msalSubject$
    //   .pipe(
    //     filter((msg: EventMessage) => {
    //       return msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS;
    //     }),
    //   )
    //   .subscribe((result: EventMessage) => {
    //   });

    // this.broadcastService.inProgress$
    //   .pipe(
    //     filter((status: InteractionStatus) => {
    //       return status === InteractionStatus.None;
    //     }),
    //     takeUntil(this._destroying$)
    //   )
    //   .subscribe((event) => {
    //   });
    this.callGraphApi();
  }

  callGraphApi() {
    // this.apiService.getUserProfileDetails((cbs: any) => {
    //   if (cbs && cbs != undefined) {
    //     this.commonService.setStorageItems("graph_details", JSON.stringify(cbs))
    //     this.checkAndSetActiveAccount();
    //   }
    // }, (cbe: HttpErrorResponse) => {
    //   console.error(cbe)
    // });
    const cbs = {
      "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity",
      "businessPhones": [
          "1234567890"
      ],
      "displayName": "Dasika, Chandra Sekhar",
      "givenName": "Chandra Sekhar ",
      "jobTitle": "Key Digest App Developer",
      "mail": "test123@cognizant.com",
      "mobilePhone": null,
      "officeLocation": null,
      "preferredLanguage": null,
      "surname": "Dasika",
      "userPrincipalName": "v563447@amerisourcebergen.com",
      "id": "a09a732c-f0a4-4a98-bf7a-6e36b187c9f2"
  }
    this.commonService.setStorageItems("graph_details", JSON.stringify(cbs))
    // this.checkAndSetActiveAccount();
    this.getUserMetadata();
  }

  checkAndSetActiveAccount() {
    // let activeAccountList = this.authService.instance.getAllAccounts();
    // if (activeAccountList.length > 0) {
    //   this.authService.instance.setActiveAccount(activeAccountList[0]);
    //   this.callInitialRoleApi(activeAccountList[0])
    // }
  }

  callInitialRoleApi(accountObj: any) {
    // this.authService.acquireTokenSilent({
    //   account: accountObj,
    //   scopes: [environment.custom_scope + '.default'],
    //   //   scopes: ['api://45353350-7eb7-43ef-afd2-5d6e390c3983/user_impersonation']
    // }).subscribe((response) => {
    //   this.commonService.setStorageItems("raw", JSON.stringify(btoa(response.accessToken)))
    //   this.getUserMetadata();
    // }, (error) => {
    //   console.error(error)
    // });
  }

  getUserMetadata() {
    // this.apiService.getInitialRoles()
    //   .subscribe((cbs) => {
    //     if (cbs['success'] == true) {
    //       this.commonService.setStorageItems("metaData", JSON.stringify(cbs['data']))
    //       if (cbs['data']['isOnboarded']) this.router.navigate(['/home']);
    //       else this.router.navigate(['/onboarding']);
    //     }
    //   }, (cbe: HttpErrorResponse) => {
    //     console.error(cbe.message)
    //   })
    const cbs = {
      "success": true,
      "message": "User Details Extracted Successfully",
      "data": {
        // add this same employee id in the database
          "emp_id": "a09a732c-f0a4-4a98-bf7a-6e36b187c9f2", 
          "first_name": "Chandra Sekhar",
          "last_name": "Dasika",
          // "unique_name": "abc123@cogizant.com",
          "department_name": "Health systems",
          "role": "Admin",
          "isOnboarded": false
      }
  }

    if (cbs['success'] == true) {
      this.commonService.setStorageItems("metaData", JSON.stringify(cbs['data']))
      if (cbs['data']['isOnboarded']) this.router.navigate(['/home']);
      else this.router.navigate(['/onboarding']);
    }
  }

  login() {
    // if (this.msalGuardConfig.authRequest) {
    //   this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    // } else {
    //   this.authService.loginRedirect();
    // }
  }

  logout() { // Add log out function here
    // this.authService.logoutRedirect({
    //   postLogoutRedirectUri: environment.redirectUri
    // });
    // this._destroying$.next(undefined);
    // this._destroying$.complete();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
