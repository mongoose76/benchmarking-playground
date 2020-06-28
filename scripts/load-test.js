import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: "30s", target: 1000 }, // simulate ramp-up of traffic from 1 to 1000 users over 30 s.
    { duration: "30s", target: 1000 }, // stay at 1000 users for 30 s
    { duration: "30s", target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    'http_req_duration': ['p(99)<100'], // 99% of requests must complete below 100ms
  }
};

export default function() {
  let event = { 
    type: "spin",
    value: Math.round(100 * Math.random())
  };
  let url = 'http://127.0.0.1:3000/events';
  let res = http.post(url, event);

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(1);
}