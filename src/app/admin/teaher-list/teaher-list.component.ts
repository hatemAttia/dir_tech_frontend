import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-teaher-list',
  templateUrl: './teaher-list.component.html',
  styleUrls: ['./teaher-list.component.css']
})
export class TeaherListComponent implements OnInit {
  listTeacher;
  searchName='';
  tSearch=false;
  page=1;
  constructor( public adminServ: AdminService,
    private router: Router) { }


  ngOnInit() {
    this.display();

  }

  display(){
    this.adminServ.getAllTeacher().subscribe((resp: any) => {
      console.log(resp);
      this.listTeacher=resp;
    },error =>{ 
      console.log(error);
    });
  }
  toggleSearch(){
    this.tSearch=!this.tSearch;
  }
 
  deleteTeacher(id){
    this.adminServ.deleteTeacher(id).subscribe((res:any)=>{
      console.log(res)
    })
    this.display();
  }
}
