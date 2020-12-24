import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TailwindcssComponent } from './tailwindcss.component';

describe('TailwindcssComponent', () => {
  let component: TailwindcssComponent;
  let fixture: ComponentFixture<TailwindcssComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TailwindcssComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TailwindcssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
