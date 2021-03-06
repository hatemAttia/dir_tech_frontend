import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userUploaded = false;
  dropdownSettings: IDropdownSettings = {};
  currentPassword:any;
  confPassword:any;
  newPassword:any;
  options:any;
  userData:any;
  image:any;
  imageFile:any;
  imageImageUploaded = false;
  dropdownList = [];
  userConnected:any;
  _imgButtonEnabel = true;
  _profilButtonEnabel = true;
  profilForm: FormGroup;
  diplomaList = [];
  establishments = [];
  optionsstuff = [];

  constructor(private modalService: NgbModal, private userServ: UserService, private authServ: AuthService, private formBuilder: FormBuilder) {

    this.userConnected = this.authServ.getRole();
    this.userData = this.userServ.getUserData();
    this.image = "http://localhost:3000/" + this.userData.avatar;
console.log(  this.image);

    this.profilForm = this.formBuilder.group({
      firstname: [this.userData.firstname, Validators.required],
      lastname: [this.userData.lastname, Validators.required],
      matricule: [this.userData.matricule, Validators.required],
      phonenumber: [this.userData.phonenumber, [Validators.required, Validators.min(10000000), Validators.maxLength(99999999)]],
      cin: [this.userData.cin, [Validators.required, Validators.min(10000000), Validators.maxLength(99999999)]],
      level: [this.userData.level],
      description: [this.userData.description],
      poste: [this.userData.poste],
      diplomainstituation: [this.userData.diplomainstituation],
      yearsexperience: [this.userData.yearsexperience],
      url: [this.userData.url],
      certificat: [this.userData.certificat],
      degreeobtained: [this.userData.degreeobtained],
      skill: [''],
    });
  }

  ngOnInit() {
    this.display();

    this.diplomaList = [
      "licence Technologie de l???informatique",
      "Dipl??me d'ing??nieur en g??nie logiciel ",
      "Master en ing??nierie des syst??mes d'information",
      "Master en s??curit?? informatique",
      "licence d'informatique",
    ]

    this.establishments = [
      "L'??cole pluridisciplinaire internationale(EPI)",
      "Ecole Nationale d???Ing??nieurs de Tunis (ENIT)",
      "Ecole Nationale d???Ing??nieurs de Sousse (ENISO)",
      "Ecole Nationale d???Ing??nieurs de Bizerte (ENIB) ",
      "Ecole Nationale d???Ing??nieurs de Monastir (ENIM)",
      "Ecole Nationale d???Ing??nieurs de Sfax (ENIS)",
      "Facult?? des Sciences de Tunis (FST)",
      "Ecole Nationale Sup??rieure d???Ing??nieurs de Tunis (ENSIT)",
      "Ecole Nationale d???Ing??nieurs de Carthage (ENI-Carthage)",
      "Ecole Nationale d???Electronique et de Communication de Sfax (ENET???Com) ",
      "Ecole Nationale des Sciences de l???Informatique (ENSI)",
      "Ecole Sup??rieure des Communications de Tunis (SUP???COM)",
      "Ecole Polytechnique de Tunisie (EPT)",
    ];

    this.optionsstuff = [
      "scolatit??",
      "equipe administrative"
    ];

    this.options = [
      "Assistant",
      "Maitre Assistant",
      "Maitre de conf??rences",
      "Ing??nieur",
      "Corp Technologue",
      "Expert",
    ];
  }

  display() {
    this.userServ.getAllSkills().subscribe((res: any) => {
      var dd = [];
      if (this.userData.skills)
        res.forEach(skill => {
          var found = this.userData.skills.filter(elment => skill.id == elment.id)
          if (found.length <= 0) {
            dd.push(skill)
          }

        });
      this.dropdownList = dd;
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };



  }
  onFileChanged(event) {
    this.imageFile = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.image = reader.result;
      this._imgButtonEnabel = false;
    }
  }

  /**
   * upload image
   */
  onUpload() {
    if (this.userConnected == "ROLE_TEACHER") {
      this.userServ.UpdateImageTeacher(this.imageFile, this.userData.id).subscribe(resp => {
        this.showNotif();
      })
    } else if (this.userConnected == "ROLE_STUFF") {
      this.userServ.UpdateImageStuff(this.imageFile, this.userData.id).subscribe(resp => {
        this.showNotif();
      })
    }
  }

  /**
   * 
   * @param item 
   */
  onItemSelect(item: any) {
    console.log(item);
  }

  /**
   * 
   */
  onSelectAll(items: any) {
    console.log(items);
  }

  /**
   * update user
   */
  updateUser() {
    if (this.userConnected == "ROLE_TEACHER") {
      this.userServ.updateUserTeacher(this.profilForm.value, this.userData.id).subscribe(resp => {
        this.userUploaded = true;
        this.userData = this.userServ.getUserData();
        setTimeout(() => {
          this.userUploaded = false;
        }, 3000);
      })
    } else if (this.userConnected == "ROLE_STUFF") {
      this.userServ.updateUserStuff(this.profilForm.value, this.userData.id).subscribe(resp => {
        this.userData = this.userServ.getUserData();
        this.userUploaded = true;
        setTimeout(() => {
          this.userUploaded = false;
        }, 3000);
      })
    }
  }

  showNotif() {
    this.imageImageUploaded = true;
  }

  closeNotif() {
    this.imageImageUploaded = false;
  }

  removeskills(skillId) {
    this.userServ.removeSkillInTeacher({
      "EnseignantId": this.userData.id,
      "skillId": skillId
    }).subscribe(res => {
      this.userServ.getTeacherDataFromDB().subscribe((res: any) => {
        this.userData = res;
        this.userServ.setUserData(res);
        this.display();

      });
    })
  }

  /**
   * 
   */
  addSkills() {
    if (this.profilForm.get('skill').value !== '') {
      this.userServ.addSkillToTeacher({
        "skill": this.profilForm.get('skill').value
      }).subscribe(res => {
        this.profilForm.controls['skill'].setValue("");
        setTimeout(() => {
          this.userServ.getTeacherDataFromDB().subscribe((res: any) => {
            console.log(res);
            this.userData = res;
            this.userServ.setUserData(res);
            this.display();
          });
        }, 200);
      })
    }
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }
}
