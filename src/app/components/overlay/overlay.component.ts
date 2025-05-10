import {AfterViewInit, Component, inject, ViewChild} from '@angular/core';
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {AppService} from "../../services/app.service";
import {MatSidenavContent} from "@angular/material/sidenav";
import {collection, collectionData, docData, Firestore, getDocs, setDoc} from "@angular/fire/firestore";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {AsyncPipe, JsonPipe, NgClass} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
    selector: 'app-overlay',
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatListModule,
        MatIconModule,
        AsyncPipe,
        RouterOutlet,
        NgClass,
        JsonPipe,
    ],
    templateUrl: './overlay.component.html',
    styleUrl: './overlay.component.sass'
})
export class OverlayComponent implements AfterViewInit {
  app = inject(AppService)
  @ViewChild('content') matSidenavContent: MatSidenavContent
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  firestore = inject(Firestore);
  itemCollection = collection(this.firestore, 'ranks');
  ranks$ = collectionData(this.itemCollection);
  rankRef;
  rankData;
  subscription;
  prefix = [
    {pos: null},
    {pos: null},
    {pos: null},
    {pos: null},
    {pos: null},
  ];
  suffix = [
    {pos: null},
    {pos: null},
    {pos: null},
    {pos: null},
    {pos: null},
  ];
  imagesMap = [
    {
      path: 'assets/medals/1.png',
      name: 'Herald'
    },
    {
      path: 'assets/medals/2.png',
      name: 'Guardian'
    },
    {
      path: 'assets/medals/3.png',
      name: 'Crusader'
    },
    {
      path: 'assets/medals/4.png',
      name: 'Archon'
    },
    {
      path: 'assets/medals/5.png',
      name: 'Legend'
    },
    {
      path: 'assets/medals/6.png',
      name: 'Ancient'
    },
    {
      path: 'assets/medals/7.png',
      name: 'Divine'
    },
    {
      path: 'assets/medals/8.png',
      name: 'Immortal'
    },
  ]

  constructor() {
    getDocs(this.itemCollection).then((q) => {
      this.rankRef = q.docs[0].ref;
      this.rankData = docData(this.rankRef);
      console.log(this.rankRef);
      this.subToRank()
    });
  }

  subToRank() {
    if (!this.rankData) return;
    this.subscription = this.rankData.subscribe((data) => {
      if (data.prefix) {
        this.prefix = data.prefix;
      }
      if (data.suffix) {
        this.suffix = data.suffix;
      }
    })
  }

  ngAfterViewInit() {
  }

  selectPos(pos: any, suffix: any, selectedIndex: any) {
    if (suffix) {
      this.suffix[pos].pos = selectedIndex + 1;
    } else {
      this.prefix[pos].pos = selectedIndex + 1;
    }
    if (!this.app.isBrowser) return;
    setDoc(this.rankRef, {prefix: this.prefix, suffix: this.suffix});
    // localStorage.setItem('prefix', JSON.stringify(this.prefix));
    // localStorage.setItem('suffix', JSON.stringify(this.suffix));
  }

  log(e) {
    console.log(e)
  }
}
