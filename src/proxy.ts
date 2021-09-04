// TODO: local test (작업중)

// import proxy from 'redbird';

// proxy({
//   port: 80,
//   ssl: {
//     http2: true,
//     port: 443, // SSL port used to serve registered https routes with LetsEncrypt certificate.
//     key: './secrets/AuthKey_ZC25JZUJ4G.key',
//     cert: './secrets/certificate.crt',
//   },
// });

// // Angular apps

// proxy.register('api.opggmobilea.com', 'http://localhost:9999', {
//   port: 80,
//   ssl: {
//     http2: true,
//     port: 443, // SSL port used to serve registered https routes with LetsEncrypt certificate.
//     key: './secrets/AuthKey_ZC25JZUJ4G.key',
//     cert: './secrets/certificate.crt',
//   },
// });
// // NestJS services
// proxy.register('api.opggmobilea.com/auth/apple', 'http://localhost:3000');
