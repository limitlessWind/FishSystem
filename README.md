# FishSystem
An ionic app based on TGC(Thermal Growth Coefficient) to predict the weight and needs of fishes. 

 ## Running
 * Clone this repository.
 * Run `npm install` from the project root.
 * If you do not install the ionic CLI (`npm install -g ionic`)
 * Run `ionic serve` in a terminal from the project root.
 
  ## App Preview
 <img src="https://raw.githubusercontent.com/wiki/limitlessWind/FishSystem/fish-predict.jpg" alt="Preview" height="1000px" width="500px">
 <img src="https://raw.githubusercontent.com/wiki/limitlessWind/FishSystem/fishtype.jpg" alt="Preview" height="1000px" width="500px">
 
 ## main structure
 ```
 .
 ├── src
 │   ├── index.html
 │   ├── app
 │   │   ├── app.component.ts
 │   │   ├── app.html
 │   │   ├── app.module.ts
 │   │   ├── app.scss
 │   │   └── main.ts
 │   ├── assets                               * some imgs needed for this app
 │   │   
 │   ├── components/progress-bar              * progress-bar component
 |   |
 │   ├── providers
 │   │   └── http.ts                          * send http requests
 │   ├── pages
 │   │   ├── ingre                            * ingre tab -- fish feeds list
 |   |   ├── ingre-detail                     * detail info of a feed
 │   │   ├── tgc                              * tgc tab -- choose a fish to compute tgc
 │   │   ├── tgc-compute                      * compute tgc
 │   │   ├── predict                          * predic tab
 │   │   ├── predict-detail                   * initial page to predict
 │   │   ├── predict-result                   * result of predict
 │   │   ├── fishtype                         * fishtype tab -- show all fishes
 │   │   ├── user                             * user tab
 │   │   └── tabs
 │   └── theme
 │       └── variables.scss
 ├── tsconfig.json
 └── tslint.json
 ```
 
 ## enviroment
 ```
 ionic (Ionic CLI) : 4.0.2
 npm: 5.6.0
 Cordova cli: 8.0.0
 Node: v8.11.3
 ```
