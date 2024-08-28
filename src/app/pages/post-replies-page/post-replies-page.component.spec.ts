import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRepliesPageComponent } from './post-replies-page.component';

describe('PostRepliesPageComponent', () => {
  let component: PostRepliesPageComponent;
  let fixture: ComponentFixture<PostRepliesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostRepliesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostRepliesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
