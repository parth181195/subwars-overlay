import {Component, inject, Query} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from "@angular/material/dialog";
import {collection, doc, Firestore, getDoc, getDocs, query, where} from "@angular/fire/firestore";
import {MatButton} from "@angular/material/button";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-user-popup',
    imports: [
        MatDialogContent,
        MatButton,
        MatDialogActions,
        MatProgressSpinner,
        MatDialogClose,
        MatDialogTitle
    ],
    templateUrl: './user-popup.component.html',
    styleUrl: './user-popup.component.sass'
})
export class UserPopupComponent {
  readonly dialogRef = inject(MatDialogRef<UserPopupComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  fs = inject(Firestore);
  loading = true;
  user:any = {};

  constructor() {
    console.log(this.data)
    getDocs(query(collection(this.fs, 'users'),where('uid', '==', this.data.id))).then((querySnapshot) => {
      this.user = querySnapshot.docs[0].data();
      this.loading = false;
    })
  }

}
