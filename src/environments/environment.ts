// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    foodOrderingBaseApiUrl: 'http://localhost:8080/api',
    firebaseConfig: {
        apiKey: 'AIzaSyAZFFIuXkbgdp2F-Em4CK2z8kVJ2L4p_UU',
        authDomain: 'foodify-55954.firebaseapp.com',
        databaseURL: 'https://foodify-55954-default-rtdb.firebaseio.com/',
        projectId: 'foodify-55954',
        storageBucket: 'foodify-55954.appspot.com',
        messagingSenderId: '213676556381',
        appId: '1:213676556381:web:865bb2e949d708cae88db4',
        measurementId: 'G-TV0D4CW51W'
    },
    adminImg: 'https://firebasestorage.googleapis.com/v0/b/foodify-55954.appspot.com/o/Admin%2FAdmin-logo.png?alt=media&token=78243742-a2d4-4376-95bd-2b69ab0b69ac'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
