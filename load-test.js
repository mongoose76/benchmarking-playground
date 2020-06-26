import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 1000,
  duration: '30s',
  thresholds: {
    'http_req_duration': ['p(99)<100'], // 99% of requests must complete below 1.5s
  }
};

export default function() {
  let event = { 
    type: "spin",
    value: Math.round(100 * Math.random())
  };

  let res = http.post('http://127.0.0.1:3000/events', event);

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(500);
}