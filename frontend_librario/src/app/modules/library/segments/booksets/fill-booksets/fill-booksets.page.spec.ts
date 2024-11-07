import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FillBooksetsPage } from './fill-booksets.page';

describe('FillBooksetsPage', () => {
  let component: FillBooksetsPage;
  let fixture: ComponentFixture<FillBooksetsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FillBooksetsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
