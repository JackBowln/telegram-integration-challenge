import { Component, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';


const baseUrl = `https://api.telegram.org/bot1830375992:AAHCBHbeb1CHhOfo4eY-WEpbt4N6WsoWB68`
interface Role {
  value: string;
  viewValue: string;
}
export interface DialogData {
  dialogMessage: string;
  status: string;
  color: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Formulário de recrutamento e seleção';


  public form: {
		name: string;
		email: string;
		motivation: String;
    message: String;
    role: String;
		file: any;
	};

  fileName=''

  roles: Role[] = [
    {value: 'Desenvolvedor Frontend', viewValue: 'Desenvolvedor Frontend'},
    {value: 'Desenvolvedor Backend', viewValue: 'Desenvolvedor Backend'},
    {value: 'Desenvolvedor Fullstack', viewValue: 'Desenvolvedor Fullstack'},
    {value: 'Engenheiro de Dados', viewValue: 'Engenheiro de Dados'},
  ];
  constructor(private http: HttpClient, public dialog: MatDialog) {
    this.form = {
      name: "",
      email: "",
      motivation: "",
      message: "",
      role: "",
      file: null,
    }

  }
  openDialog(message: string, status: string = 'Sucesso', color: string = 'success') {
    this.dialog.open(DialogComponent, {
      data: { dialogMessage: message, status: status, color: color }
    });
  }
  sendMessage() {
    let message = `\n\n<strong>Novo Candidato chegou!</strong>\n\n<strong>Nome:</strong> ${this.form.name}\n<strong>Email:</strong> ${this.form.email}\n<strong>Vaga:</strong> ${this.form.role}\n<strong>Motivação do candidato:</strong> ${this.form.motivation}\n<strong>Mensagem:</strong> ${this.form.message}\n`
    let httpParams = new HttpParams()
      .set('text', message)
      .set('chat_id', '-554585724')
      .set('parse_mode', 'html')
      const upload$ = this.http.post(`${baseUrl}/sendDocument`, this.form.file)
      const sender$= this.http.post(`${baseUrl}/sendMessage`, httpParams)
      if(this.form.email && this.form.name && this.form.role && this.form.file) {
        upload$.subscribe(res=> { console.log(res)});
        sender$.subscribe(res=> {
          this.openDialog('Candidatura enviada com sucesso aguarde o email com mais detalhes')
          console.log(res)});
      } else {
        this.openDialog("Nome, Email, Cargo e Currículo são campos obrigatórios", 'Erro', 'warn')
      }

  }

  inputFileChange(event: any) {
    const file:File = event.target.files[0];
    if (file) {
      this.fileName = file.name
        const formData = new FormData();

        formData.append('document', file);
        formData.append('chat_id','-554585724');

        this.form.file = formData
    }
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  nameFormControl = new FormControl('', [
    Validators.required,
  ]);
  roleFormControl = new FormControl('', [
    Validators.required,
  ]);

}

@Component({
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}


