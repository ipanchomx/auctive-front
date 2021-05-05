import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auction-detail',
  templateUrl: './auction-detail.component.html',
  styleUrls: ['./auction-detail.component.scss']
})
export class AuctionDetailComponent implements OnInit {

  public slides = [
    "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg", 
    "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_960_720.jpg",
    "https://www.acueducto.com.co/guatoc/Archivos/resources/seccion_gerente/images/Colourful_Tulip_large.jpg"
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
