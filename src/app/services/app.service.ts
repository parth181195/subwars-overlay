import {effect, Inject, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {isPlatformBrowser} from "@angular/common";
import {MatSidenavContent} from "@angular/material/sidenav";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private breakpoint = inject(BreakpointObserver)
  public isMobile$: Observable<boolean> = this.breakpoint.observe([Breakpoints.XSmall, ,])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public isTab$: Observable<boolean> = this.breakpoint.observe([Breakpoints.Small, ,])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public isPortable$: Observable<boolean> = this.breakpoint.observe([Breakpoints.XSmall, Breakpoints.Small,])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public isLandscape$: Observable<boolean> = this.breakpoint.observe([Breakpoints.HandsetLandscape, Breakpoints.WebLandscape, Breakpoints.TabletLandscape,])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

}
