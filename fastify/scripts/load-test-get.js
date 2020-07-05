import http from 'k6/http';
import { sleep, check } from 'k6';

let vus = 2000;
export let options = {
  stages: [
    { duration: "5s", target: vus }, // simulate ramp-up of traffic from 1 to max users over 30 s.
    { duration: "55s", target: vus }, // stay at max users for 30 s
  ],
  thresholds: {
    'http_req_duration': ['p(99)<100'], // 99% of requests must complete below 100ms
  }
};

export default function() {
  let url = 'http://127.0.0.1:3000/';
  let res = http.get(url);

  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  sleep(1);
}