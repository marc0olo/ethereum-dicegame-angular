import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaindataComponent } from './chaindata.component';

describe('ChaindataComponent', () => {
  let component: ChaindataComponent;
  let fixture: ComponentFixture<ChaindataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaindataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChaindataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
