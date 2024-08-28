import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyCreateComponent } from './reply-create.component';

describe('ReplyCreateComponent', () => {
  let component: ReplyCreateComponent;
  let fixture: ComponentFixture<ReplyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReplyCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
