import { TestBed } from '@angular/core/testing';

import { TweetLikesService } from './tweet-likes.service';

describe('TweetLikesService', () => {
  let service: TweetLikesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetLikesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
