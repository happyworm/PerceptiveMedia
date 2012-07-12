/*
 * Geo City JavaScript Library.
 *
 * Copyright (c) 2012 BBC, All Rights Reserved.
 * http://www.bbc.co.uk
 * The JavaScript client side code is available under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0.html
 * Please see the BBC R&D website for more details:
 * http://www.bbc.co.uk/rd/labs/ 
 *
 * Developed By: Happyworm Ltd http://www.happyworm.com
 * Author: Mark J Panaghiston @thepag
 * R&D: Mark Boas @maboa
 * Version: 1.0.0
 * Date: 2nd July 2012
 */

/* Code verified using http://www.jshint.com/ */
/*jshint asi:false, bitwise:false, boss:false, browser:true, curly:false, debug:false, devel:false, eqeqeq:true, eqnull:false, evil:false, forin:false, immed:false, jquery:true, laxbreak:false, newcap:true, noarg:true, noempty:false, nonew:true, onevar:false, passfail:false, plusplus:false, regexp:false, undef:true, sub:false, strict:false, white:false smarttabs:true */
/*global */

var getCity = (function($, undefined) {

	return function(callback) {

		var cities = [
			{
				city:"Bath",
				lt:51.378,
				ln:-2.359,
				attraction1:"Bath Abbey",
				attraction2:"Royal Victoria Park",
				attraction3:"Royal Crescent",
				eat:"Sally Lunns",
				drink:"The Tram Shed",
				weather:2656173
			},
			{
				city:"Birmingham",
				lt:52.481,
				ln:-1.9,
				attraction1:"Bull Ring",
				attraction2:"Birmingham and Fazely Canal",
				attraction3:"The Cathedral",
				eat:"Purnells",
				drink:"Island Bar",
				weather:2655603
			},
			{
				city:"Bradford",
				lt:53.794,
				ln:-1.752,
				attraction1:"National Media Museum",
				attraction2:"City Hall",
				attraction3:"The Cathedral",
				eat:"Great Victoria Hotel",
				drink:"Symposium",
				weather:2654993
			},
			{
				city:"Brighton & Hove",
				lt:50.828,
				ln:-0.153,
				attraction1:"Booth Museum of Natural History",
				attraction2:"Royal Pavilion",
				attraction3:"Brighton Pier",
				eat:"Grand Central",
				drink:"Black Lion",
				weather:2646504
			},
			{
				city:"Bristol",
				lt:51.455,
				ln:-2.597,
				attraction1:"Blaise Castle",
				attraction2:"Old Vic Theatre",
				attraction3:"The Cathedral",
				eat:"Glass Boat",
				drink:"Blaise Castle",
				weather:2654675

			},
			{
				city:"Cambridge",
				lt:52.2,
				ln:0.117,
				attraction1:"Trinity College",
				attraction2:"Fitzwilliam Museum",
				attraction3:"Kettles Yard",
				eat:"Jamies Italian",
				drink:"The Fountain Inn",
				weather:2653941
			},
			{
				city:"Canterbury",
				lt:51.279,
				ln:1.08,
				attraction1:"Canterbury Cathedral",
				attraction2:"Rupert Bear Museum",
				attraction3:"Barnsole Vineyard",
				eat:"Boho",
				drink:"The City Arms",
				weather:2653877
			},
			{
				city:"Carlisle",
				lt:54.895,
				ln:-2.938,
				attraction1:"The Guildhall Museum",
				attraction2:"The Sands Centre",
				attraction3:"The Cathedral",
				eat:"Sharrow bay",
				drink:"Circle Cafe Bar",
				weather:2653775
			},
			{
				city:"Chester",
				lt:53.191,
				ln:-2.892,
				attraction1:"Grosvenor Museum",
				attraction2:"Chester Zoo",
				attraction3:"The Cathedral",
				eat:"Blue Moon",
				drink:"Coach House",
				weather:2653775
			},
			{
				city:"Chichester",
				lt:50.837,
				ln:-0.78,
				attraction1:"Chichester Cathedral",
				attraction2:"South Downs Planetarium and Science Centre",
				attraction3:"The Cathedral",
				eat:"El Castizo",
				drink:"The George and Dragon Inn",
				weather:2653192
			},
			{
				city:"Coventry",
				lt:52.407,
				ln:-1.512,
				attraction1:"Coventry Transport Museum",
				attraction2:"Holy Trinity Church",
				attraction3:"The Cathedral",
				eat:"Bella Italia",
				drink:"Browns Independent Bar",
				weather:2652221
			},
			{
				city:"Derby",
				lt:52.923,
				ln:-1.477,
				attraction1:"St Marys Church",
				attraction2:"Derby Industrial Museum",
				attraction3:"The Cathedral",
				eat:"Mount Everest",
				drink:"Quad",
				weather:2651347
			},
			{
				city:"Durham",
				lt:54.777,
				ln:-1.576,
				attraction1:"Durham Cathedral",
				attraction2:"Saint Johns College",
				attraction3:"The Glass and Art Gallery",
				eat:"Zen",
				drink:"Slug and Lettuce",
				weather:2650628
			},
			{
				city:"Ely",
				lt:52.399,
				ln:0.258,
				attraction1:"Oliver Cromwells House",
				attraction2:"Roswell Pits",
				attraction3:"The Cathedral",
				eat:"Peacocks Tea room",
				drink:"The Lazy Otter",
				weather:2650023
			},
			{
				city:"Exeter",
				lt:50.724,
				ln:-3.528,
				attraction1:"Northernhay Gardens",
				attraction2:"Rougemont Castle",
				attraction3:"The Cathedral",
				eat:"Pitcher and Piano",
				drink:"On The Waterfront",
				weather:2649808
			},
			{
				city:"Gloucester",
				lt:51.866,
				ln:-2.243,
				attraction1:"The Cathedral",
				attraction2:"The New Inn",
				attraction3:"Gloucester Waterways Museum Gloucester",
				eat:"Angel Chef",
				drink:"The Tudor Arms",
				weather:2648404
			},
			{
				city:"Hereford",
				lt:52.057,
				ln:-2.715,
				attraction1:"The Old House",
				attraction2:"Hereford Museum and Art Gallery",
				attraction3:"The Cathedral",
				eat:"The Green Dragon",
				drink:"The Courtyard",
				weather:2647074
			},
			{
				city:"Kingston upon Hull",
				lt:53.75,
				ln:-0.333,
				attraction1:"The Deep",
				attraction2:"City Hall",
				attraction3:"Streetlife Museum of Transport",
				eat:"Hitchcocks",
				drink:"Walters",
				weather:2645425
			},
			{
				city:"Lancaster",
				lt:54.067,
				ln:-2.833,
				attraction1:"Maritime Museum",
				attraction2:"Peter Scott Gallery",
				attraction3:"The Cathedral",
				eat:"Bistro 26",
				drink:"Revolution Bar",
				weather:2644972
			},
			{
				city:"Leeds",
				lt:53.796,
				ln:-1.548,
				attraction1:"Millennium Square",
				attraction2:"Kirkstall Abbey",
				attraction3:"The Cathedral",
				eat:"Las Iguanas",
				drink:"The Wardrobe",
				weather:2644688
			},
			{
				city:"Leicester",
				lt:52.639,
				ln:-1.132,
				attraction1:"Jewry Wall Museum",
				attraction2:"Abbey Park",
				attraction3:"The Cathedral",
				eat:"Cafe Rouge",
				drink:"The Basement",
				weather:2644668
			},
			{
				city:"Lichfield",
				lt:52.682,
				ln:-1.825,
				attraction1:"Lichfield Garrick Theatre",
				attraction2:"Samuel Johnson Museum",
				attraction3:"The Cathedral",
				eat:"The Hedgehog",
				drink:"Turnpike",
				weather:2644531
			},
			{
				city:"Lincoln",
				lt:53.227,
				ln:-0.538,
				attraction1:"Lincoln Castle",
				attraction2:"Jews House",
				attraction3:"The Cathedral",
				eat:"Browns Pie Shop",
				drink:"Magna Carta",
				weather:2644487
			},
			{
				city:"Liverpool",
				lt:53.411,
				ln:-2.978,
				attraction1:"Merseyside Maritime Museum",
				attraction2:"Albert Dock",
				attraction3:"The Cathedral",
				eat:"Zizzis",
				drink:"The Pumphouse",
				weather:2644210
			},
			{
				city:"London",
				lt:51.509,
				ln:-0.126,
				attraction1:"Natural History Museum",
				attraction2:"National Gallery",
				attraction3:"Saint Pauls Cathedral",eat:"Belgo",
				drink:"12 Bar Club",
				weather:2643743
			},
			{
				city:"Manchester",
				lt:53.481,
				ln:-2.237,
				attraction1:"The Printworks",
				attraction2:"Chorlton Water Park",
				attraction3:"The Cathedral",
				eat:"Harvey Nichols",
				drink:"Rain Bar",
				weather:2643123
			},
			{
				city:"Newcastle upon Tyne",
				lt:54.973,
				ln:-1.614,
				attraction1:"The Sage",
				attraction2:"Discovery Museum",
				attraction3:"Christ Church Cathedral",
				eat:"Blackfriars",
				drink:"The Tyne Bar",
				weather:2641673
			},
			{
				city:"Norwich",
				lt:52.628,
				ln:1.298,
				attraction1:"Norwich Castle Museum",
				attraction2:"Dragon Hall",
				attraction3:"The Cathedral",
				eat:"Thai on the river",
				drink:"Franks Bar",
				weather:2641181
			},
			{
				city:"Nottingham",
				lt:52.954,
				ln:-1.15,
				attraction1:"Lace Market",
				attraction2:"Brewhouse Yard Museum",
				attraction3:"Saint Barnabas Cathedral",
				eat:"Petit Paris",
				drink:"Broadway",
				weather:2641170
			},
			{
				city:"Oxford",
				lt:51.752,
				ln:-1.256,
				attraction1:"Christ Church Cathedral",
				attraction2:"Ashmolean Museum",
				attraction3:"Pitt Rivers Museum",
				eat:"Jamies Italian",
				drink:"The Bear Inn",
				weather:2640729
			},
			{
				city:"Peterborough",
				lt:52.574,
				ln:-0.248,
				attraction1:"Flag Fen",
				attraction2:"London Road Stadium",
				attraction3:"The Cathedral",
				eat:"Bombat Brasserie",
				drink:"The Brewery Tap",
				weather:2640354
			},
			{
				city:"Plymouth",
				lt:50.372,
				ln:-4.143,
				attraction1:"National Marine Aquarium",
				attraction2:"Tinside Pool",
				attraction3:"The Cathedral",
				eat:"Platters",
				drink:"Bar Cuba",
				weather:264019
			},
			{
				city:"Portsmouth",
				lt:50.799,
				ln:-1.091,
				attraction1:"H M S Victory",
				attraction2:"Gunwharf Quays",
				attraction3:"The Cathedral",
				eat:"Sopranos",
				drink:"The Still and West",
				weather:2639996
			},
			{
				city:"Preston",
				lt:53.767,
				ln:-2.717,
				attraction1:"Harris Museum",
				attraction2:"Avenham Park",
				attraction3:"The Cathedral",
				eat:"Tiggis",
				drink:"Forum",
				weather:2639912
			},
			{
				city:"Ripon",
				lt:54.135,
				ln:-1.521,
				attraction1:"Ripon Cathedral",
				attraction2:"Ripon Racecourse",
				attraction3:"The Cathedral",
				eat:"The Water Rat",
				drink:"The White Horse",
				weather:2639323
			},
			{
				city:"Salford",
				lt:53.5,
				ln:-2.333,
				attraction1:"Salford Docks",
				attraction2:"Lowry Centre",
				attraction3:"The Cathedral",
				eat:"Wagamama",
				drink:"Cloud 23",
				weather:2638671
			},
			{
				city:"Salisbury",
				lt:51.069,
				ln:-1.796,
				attraction1:"Stone Henge",
				attraction2:"Sarum College",
				attraction3:"The Cathedral",
				eat:"The Old Mill",
				drink:"The Haunch Of Venison",
				weather:2638664
			},
			{
				city:"Sheffield",
				lt:53.417,
				ln:-1.5,
				attraction1:"Motorpoint Arena Sheffield",
				attraction2:"Sheffield Ski Village",
				attraction3:"The Cathedral",
				eat:"Piccolino",
				drink:"Revolution",
				weather:2638077
			},
			{
				city:"Southampton",
				lt:50.917,
				ln:-1.383,
				attraction1:"Maritime Museum",
				attraction2:"Holyrood Church",
				attraction3:"Mottisfont Abbey",
				eat:"Coco Rio",
				drink:"The Hobbit",
				weather:2637487
			},
			{
				city:"St Albans",
				lt:51.75,
				ln:-0.333,
				attraction1:"Kingsbury Watermill",
				attraction2:"Roman wall",
				attraction3:"The Cathedral",
				eat:"Darcys",
				drink:"The Goat Inn",
				weather:2638867
			},
			{
				city:"Stoke-on-Trent",
				lt:53,
				ln:-2.167,
				attraction1:"Gladstone Pottery Museum",
				attraction2:"Britannia Stadium",
				attraction3:"Trentham Gardens",
				eat:"Portofino",
				drink:"The Sugarmill",
				weather:2636841
			},
			{
				city:"Sunderland",
				lt:54.883,
				ln:-1.417,
				attraction1:"National Glass Centre",
				attraction2:"St Peter's Church",
				attraction3:"The Minster",
				eat:"Asiana Fusion",
				drink:"Luma",
				weather:2636531
			},
			{
				city:"Truro",
				lt:50.265,
				ln:-5.054,
				attraction1:"Truro Cathedral",
				attraction2:"Hall for Cornwall",
				attraction3:"The Cathedral",
				eat:"Indaba Fish",
				drink:"The Riverbank",
				weather:2635412
			},
			{
				city:"Wakefield",
				lt:53.683,
				ln:-1.498,
				attraction1:"Sandal Castle",
				attraction2:"Theatre Royal",
				attraction3:"The Cathedral",
				eat:"Rustico",
				drink:"The Hop",
				weather:2634910
			},
			{
				city:"Wells",
				lt:51.208,
				ln:-2.649,
				attraction1:"Wells and Mendip Museum",
				attraction2:"Bishops Palace",
				attraction3:"The Cathedral",
				eat:"Goodfellows",
				drink:"Cafe Piano",
				weather:2634569
			},
			{
				city:"Westminster",
				lt:51.5,
				ln:-0.117,
				attraction1:"Guards Chapel",
				attraction2:"Strutton Ground Market",
				attraction3:"Westminster Abbey",
				eat:"Uno",
				drink:"The Jugged Hare",
				weather:2634341
			},
			{
				city:"Winchester",
				lt:51.065,
				ln:-1.319,
				attraction1:"Winchester Castle",
				attraction2:"Winchester City Mill",
				attraction3:"The Cathedral",
				eat:"Kazan",
				drink:"The Elusive Camel Victoria",
				weather:2633858
			},
			{
				city:"Wolverhampton",
				lt:52.585,
				ln:-2.123,
				attraction1:"Wolverhampton Art Gallery",
				attraction2:"Bantock House Museum and Park",
				attraction3:"The Cathedral",
				eat:"Made in Thai",
				drink:"The Great Western",
				weather:2633691
			},
			{
				city:"Worcester",
				lt:52.189,
				ln:-2.22,
				attraction1:"Lea & Perrins",
				attraction2:"The Commandery",
				attraction3:"The Cathedral",
				eat:"Saffrons",
				drink:"The Marrs Bar",
				weather:2633563
			},
			{
				city:"York",
				lt:53.964,
				ln:-1.091,
				attraction1:"York Minster",
				attraction2:"Yorvik Viking Centre",
				attraction3:"National Railway Museum",
				eat:"The Lime House",
				drink:"Evil Eye Lounge",
				weather:2633352
			},
			{
				city:"Aberdeen",
				lt:57.144,
				ln:-2.098,
				attraction1:"Provost Skene",
				attraction2:"Kirk of St Nicholas",
				attraction3:"Saint Marys Cathedral",
				eat:"La Tasca",
				drink:"The Moorings Bar",
				weather:2657832
			},
			{
				city:"Dundee",
				lt:56.5,
				ln:-2.967,
				attraction1:"Camperdown Country Park",
				attraction2:"McManus Galleries",
				attraction3:"The Cathedral",
				eat:"Papa Joes",
				drink:"Braes",
				weather:2650752
			},
			{
				city:"Edinburgh",
				lt:55.95,
				ln:-3.193,
				attraction1:"Scottish National Gallery of Modern Art",
				attraction2:"Edinburgh Castle",
				attraction3:"Saint Giles Cathedral",
				eat:"The Witchery",
				drink:"The Dome",
				weather:2650225
			},
			{
				city:"Glasgow",
				lt:55.867,
				ln:-4.25,
				attraction1:"Glasgow Royal Concert Hall",
				attraction2:"Glasgow Science Centre",
				attraction3:"The Cathedral",
				eat:"Two Fat Ladies",
				drink:"King Tuts Wah Wah Hut",
				weather:2648579
			},
			{
				city:"Inverness",
				lt:57.479,
				ln:-4.224,
				attraction1:"Inverness Castle",
				attraction2:"Bught Park",
				attraction3:"The Cathedral",
				eat:"The Mustard Seed",
				drink:"Johnny Foxes",
				weather:2646088
			},
			{
				city:"Stirling",
				lt:56.119,
				ln:-3.937,
				attraction1:"Wallace Monument",
				attraction2:"Albert Halls",
				attraction3:"The Cathedral",
				eat:"Hermanns",
				drink:"Nicky Tams",
				weather:2636910
			},
			{
				city:"Bangor",
				lt:54.653,
				ln:-5.669,
				attraction1:"Powis and Prichard-Jones Halls",
				attraction2:"Garth Pier",
				attraction3:"The Cathedral",
				eat:"Noodle One",
				drink:"Varsity",
				weather:2656397
			},
			{
				city:"Cardiff",
				lt:51.5,
				ln:-3.167,
				attraction1:"Millennium Stadium",
				attraction2:"Norwegian Church",
				attraction3:"The Cathedral",
				eat:"Bellinis",
				drink:"Buffalo Bar",
				weather:2653822
			},
			{
				city:"Newport",
				lt:51.583,
				ln:-3,
				attraction1:"Transporter Bridge",
				attraction2:"Newport Wetlands Reserve",
				attraction3:"The Cathedral",
				eat:"Junction 28",
				drink:"The Tom Toya Lewis",
				weather:2641598
			},
			{
				city:"Saint Davids",
				lt:51.883,
				ln:-5.267,
				attraction1:"Whitesands Bay",
				attraction2:"Celtic Old Cross",
				attraction3:"The Cathedral",
				eat:"The Shed",
				drink:"Sloop Inn",
				weather:2638821
			},
			{
				city:"Swansea",
				lt:51.583,
				ln:-4,
				attraction1:"Swansea Museum",
				attraction2:"Grand Theatre",
				attraction3:"The Cathedral",
				eat:"Gallinis ",
				drink:"No Sign Wine Bar",
				weather:2636432
			},
			{
				city:"Armagh",
				lt:54.35,
				ln:-6.667,
				attraction1:"The Observatory",
				attraction2:"The Planetarium",
				attraction3:"Saint Patricks Cathedral ",
				eat:"Embers",
				drink:"The Hole In The Wall",
				weather:2657060
			},
			{
				city:"Belfast",
				lt:54.583,
				ln:-5.933,
				attraction1:"Waterfront Hall",
				attraction2:"Stormont",
				attraction3:"Saint Anne's Cathedral",
				eat:"Deanes",
				drink:"The Crown Liquor Saloon",
				weather:2655984
			},
			{
				city:"Derry",
				lt:54.998,
				ln:-7.309,
				attraction1:"Bogside",
				attraction2:"Guildhall",
				attraction3:"St Columbs Cathedral",
				eat:"La Sosta",
				drink:"Peadar O Donnells",
				weather:2643736
			},
			{
				city:"Lisburn",
				lt:54.523,
				ln:-6.035,
				attraction1:"River Lagan",
				attraction2:"Lisburn Cathedral",
				attraction3:"The Cathedral",
				eat:"The Square Bistro",
				drink:"Bar Burgundy",
				weather:2644411
			},
			{
				city:"Newry",
				lt:54.178,
				ln:-6.337,
				attraction1:"Carlingford Lough",
				attraction2:"Newry Cathedral",
				attraction3:"The Cathedral",
				eat:"The Brass Monkey",
				drink:"Art Bar Funkel",
				weather:2641581
			}
		],
		geoDataDefault = {
			city: 'your city',
			news: {
				rss: 'proxy/newspod.bbc.co.uk/rss.php',
				url: ['../audio/podcast/newspod_20120511-1718a.mp3']
			},
			movies: {
				rss: 'proxy/filmdates.co.uk/rss.php',
				comedy: ['A Fantastic Fear Of Everything'],
				horror: ['The Harsh Light of Day']
			},
			weather: {
				rss: 'proxy/weather.bbc.co.uk/rss.php',
				ref: 2643123,
				sunny: [true]
			},
			attraction: ['The Imperial War Museum', 'Urbis', 'Palace Theatre'],
			eat: ['Stock'],
			drink: ['Kro Bar']
		};

		var success = function(position) {

			// console.log('getCity():success()');

			var geoData = {
				weather: {},
				attraction: [],
				eat: [],
				drink: []
			},
			smallestSquare = 0,
			closestIndex = 0,
			square, ltDiff, lnDiff;

			geoData.longitude = position.coords.longitude;
			geoData.latitude = position.coords.latitude;

			for (var i=0; i < cities.length; i++) {

				ltDiff = cities[i].lt - geoData.latitude;
				lnDiff = cities[i].ln - geoData.longitude;
				square = ltDiff*ltDiff + lnDiff*lnDiff;

				if (smallestSquare === 0 || square < smallestSquare) {
					smallestSquare = square;
					closestIndex = i;
				}
			}
			geoData.city = cities[closestIndex].city;
			geoData.weather.ref = cities[closestIndex].weather;
			geoData.attraction[0] = cities[closestIndex].attraction1;
			geoData.attraction[1] = cities[closestIndex].attraction2;
			geoData.attraction[2] = cities[closestIndex].attraction3;
			geoData.eat[0] = cities[closestIndex].eat;
			geoData.drink[0] = cities[closestIndex].drink;

			// Calculate other stuff like distance?
			// http://www.movable-type.co.uk/scripts/latlong.html

			// console.log('geoData:');
			// console.dir(geoData);
			getRssFeeds(geoData);
		};

		var error = function(msg) {
			var geoData = {
				weather: {},
				error: true,
				errorMsg: typeof msg === 'string' ? msg : 'failed - denied by user'
			};
			getRssFeeds(geoData);
		};

		var getRssFeeds = function(geoData) {

			// Destroy the geolocation handlers, to avoid multiple calls. ie., If geolocation timeout and then user gives permission, we do not want to generate multiple callbacks.
			// Plus geolocation can give multiple calls as accuracy increases. However, we really need this info before we can start creating the story, so we have to draw a ine and get on with it at some point.
			success = function() {};
			error = function() {};

			var newsComplete, moviesComplete, weatherComplete,
			checkRssComplete = function() {
				if(newsComplete && moviesComplete && weatherComplete) {
					geoData = $.extend(true, {}, geoDataDefault, geoData); // Merge the defaults
					if(callback) setTimeout(function() { callback(geoData); }, 0);
				}
			};

			$.ajax({
				url: geoDataDefault.news.rss,
				dataType: 'xml',
				success: function(xml) {
					geoData.news = {};
					geoData.news.url = [];
					$(xml).find('item').each(function() {
						geoData.news.url.push($(this).find('link').text());
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					geoData.news = {};
					geoData.news.error = true;
					geoData.news.errorMsg = textStatus + ' : ' + errorThrown;
				},
				complete: function() {
					newsComplete = true;
					checkRssComplete();
				}
			});

			$.ajax({
				url: geoDataDefault.movies.rss,
				dataType: 'xml',
				success: function(xml) {

					var re_comedy = /(comedy|romance|farce)/i,
					re_horror = /(horror|thriller|violent|brutal|gory)/i;
					geoData.movies = {};
					geoData.movies.all = [];
					geoData.movies.comedy = [];
					geoData.movies.horror = [];

					$(xml).find('item').each(function() {
						var $this = $(this),
						title = $this.find('> title').text(),
						desc = $this.find('description').text();

						geoData.movies.all.push(title);

						if(re_comedy.test(desc)) {
							geoData.movies.comedy.push(title);
						}
						if(re_horror.test(desc)) {
							geoData.movies.horror.push(title);
						}
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					geoData.movies = {};
					geoData.movies.error = true;
					geoData.movies.errorMsg = textStatus + ' : ' + errorThrown;
				},
				complete: function() {
					moviesComplete = true;
					checkRssComplete();
				}
			});

			$.ajax({
				url: geoDataDefault.weather.rss,
				data: {ref: geoData.weather.ref ? geoData.weather.ref : geoDataDefault.weather.ref},
				dataType: 'xml',
				success: function(xml) {

					var re_sunny = /(sunny)/i;
					geoData.weather.sunny = [];

					$(xml).find('item').each(function() {
						var title = $(this).find('> title').text();
						geoData.weather.sunny.push(re_sunny.test(title));
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					// geoData.weather = {};
					geoData.weather.error = true;
					geoData.weather.errorMsg = textStatus + ' : ' + errorThrown;
				},
				complete: function() {
					weatherComplete = true;
					checkRssComplete();
				}
			});
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(a) {
				success(a);
			}, function(a) {
				error(a);
			});
			setTimeout(function() {
				error('geolocation request timed out');
			}, 20000); // A 20 second timeout on the geolocation request.
		} else {
			error('geolocation not supported');
		}
	};
})(jQuery);

/*
jQuery(document).ready(function($) {
	getCity(function(geoData) {
		initBreakingOut(geoData);
	});
});
*/