import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPostsPageComponent } from './tag-posts-page.component';

describe('TagPostsPageComponent', () => {
  let component: TagPostsPageComponent;
  let fixture: ComponentFixture<TagPostsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPostsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagPostsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
