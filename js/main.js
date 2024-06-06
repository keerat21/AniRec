// Main JavaScript and funtions

// REFERENCE: https://github.com/lukes-code/imdbApi

//Loads Home page NeuvoRec

//////////////////////////////////////////////////////////////////////////////////////

let genreOut = '';
$('#genreSearch').removeClass('genreSearch');

// initial page load
$('#noResult').removeClass('noResult');
        //search anime list; Fetch using JIKAN_V3 API; call animeList function 
        fetch(`https://api.jikan.moe/v4/anime?q=&page=1&sfw=1&order_by=popularity`)
        .then(res=>res.json())
        .then(animeList)
        .catch(err=>console.warn(err.message));

//all the events are here 
$(document).ready(() => {

    //Get search input
//searches the title bar ON KEYUP
$('#TitleForm').on('keyup', (e) => {
  $('#genreSearch').removeClass('genreSearch');
  let titleText = $('#titleText').val();
  getAnimes(titleText);
  //console.log('object mal_id: '+document.querySelector('#multi_option').value); //check mal ids in console

  e.preventDefault();

});

// search by genre event on click
$('#genreClick').on('click', (e) => {
    //#mult_optionis the genre search id; getting value from it
  let gID = $('#multi_option').val();

  // search with given genres NOTE:Limited
  APIsearchByGenres(gID);
  console.log('GID:'+gID); //get genreIDS on console
  e.preventDefault();
});


});

//search by genre; Fetch using JIKAN_V3 API;  API using GenreIDS 
function APIsearchByGenres(gList){
  fetch(`https://api.jikan.moe/v4/anime?q=&page=1&sfw=1&order_by=popularity&genres=${gList}`)
  .then(res=>res.json())
  .then(data=>{
    if (data.data.length>0)
        animeList(data)
    else 
        animeListCheck(gList)

  })
  .catch(err=>console.warn(err.message));

}



//This is the URL for the API we found that makes the MyAnimeList website searchable
const base_url = "https://api.jikan.moe/v4/";

//Receive titleText on KEYUP event
function getAnimes(titleText){
    // console.log(titleText);
            $('#genreSearch').hide();


//MyAnimeList does not let queries of less than 3 search
    if(titleText.length > 2){



        $('#no-listings').text('');
        $('#no-listings').removeClass('no-listings');
        $('#noResult').removeClass('noResult');
////////////////////////////////////

        const query = titleText;


        //search anime list; Fetch using JIKAN_V3 API; call animeList function 
        fetch(`https://api.jikan.moe/v4/anime?q=${query}&page=1&sfw=1&order_by=popularity`)
        .then(res=>res.json())
        .then(animeList)
        .catch(err=>console.warn(err.message));



///////////////////////////////////////

    } else if(titleText.length < 1){
        film = 'Find an Anime!!!';
        let output = '';
        $('#no-listings').addClass('no-listings');
        $('#no-listings').text(film);
        $('#movies').html(output);
        $('#noResult').addClass('noResult');
    } else{
        film = 'Find an Anime by typing more letters!';
        let output = '';
        $('#no-listings').addClass('no-listings');
        $('#no-listings').text(film);
        $('#movies').html(output);
        $('#noResult').addClass('noResult');
    }

}

function animeListCheck(list){
    if (list.length < 2)
        return;
    APIsearchByGenres(list.slice(0,-2));

}
//receive fetch response objects(Anime Data)
function animeList(data){
console.log(data);
  //hold array of anime ids
  let output = '';
  let mal_ids = [];
  // console.log('here '+data); //

  //reffered from https://github.com/lukes-code/imdbApi to receive an array of objects
  const animeByCategories = data.data.reduce((acc, anime)=>{

          const {type} = anime;
          if(acc[type] === undefined) acc[type] = [];
          acc[type].push(anime);
          return acc;

      }, {});

      //reffered from https://github.com/lukes-code/imdbApi to iterate each anime object from an array of objects
      Object.keys(animeByCategories).map(key=>{

          animeByCategories[key]
          .map(anime=>{
                  // isFavourite = films.includes(`${anime.title}`);
                  // console.log('animeID '+anime.mal_id);// console out anime IDS to deebug
                  mal_ids.push(anime.mal_id);

    //reffered from https://github.com/lukes-code/imdbApi to create each anime object card; 
    // output is the card having score; two buttons on hover
    output +=   `
    <div class="col-md-3 col-sm-6 col-6 movie-listing">


        <div class="well text-center">
            <div class="anime-title"><h6>${anime.title_english==null?anime.title:anime.title_english}</h6></div>
            <a onclick="animeSelected('${anime.mal_id}')" href="anime.html" id="goToMovie"><img id="moviePoster" src="${anime.images.jpg.image_url}" alt="${anime.title}"/></a>
            <div class="middle">
                <h6 class="search-title">Score: ${anime.score}</h6>
                <div class = "buttons">
                  <button id ="BB" class="action_button1" onclick="addGenres('${anime.mal_id}')" href="#" >Add genres to search</button>
                  <button id ="BB2" class="action_button2" onclick="aniRecommender('${anime.mal_id}','${anime.title}')" href="#" >Recommended Titles</button>
                </div>
                </div>
            </div>
        </div>
        `;

                      }
              )});

          console.log('IDs: '+mal_ids);


          $('#movies').html(output);


}

//list for the genre search bar


let title_trace = ''; // Ensure title_trace is declared in the outer scope

function aniRecommender(id, title) {
  title_trace = title; // Assign title_trace here
  fetch(`https://api.jikan.moe/v4/anime/${id}/recommendations`)
    .then(res => res.json())
    .then(updateDom4Recomm)
    .catch(err => console.warn(err.message));
}

function updateDom4Recomm(data) {
  let Anime = data.data;

  const animeByCategories = Anime.reduce((acc, animeObj) => {
    let anime = animeObj.entry;
    let score = animeObj.votes;
    const { mal_id, title, images } = anime;
    anime["votes"] = score;
    const image_url = images.jpg.image_url;
    const type = 'recommendations'; // Assuming all are recommendations
    if (acc[type] === undefined) acc[type] = [];
    acc[type].push({ mal_id, title, image_url, votes: score }); // Include the votes property
    return acc;
  }, {});
  $('#no-listings').text('');
  $('#no-listings').removeClass('no-listings');
  $('#noResult').removeClass('noResult');

  let output = `<div style="width: 100%;"><h4 class="Recomm">Recommendations for ${title_trace}:</h4></div><br/>`;
  Object.keys(animeByCategories).forEach(key => {
    animeByCategories[key].forEach(anime => {
      output += `
      <div class="col-md-3 col-sm-6 col-6 movie-listing">
        <div class="well text-center">
          <div class="anime-title"><h6>${anime.title}</h6></div>
          <a onclick="animeSelected('${anime.mal_id}')" href="anime.html" id="goToMovie"><img id="moviePoster" src="${anime.image_url}" alt="${anime.title}"/></a>
          <div class="middle">
            <h6 class="search-title">Votes: ${anime.votes ? anime.votes : 'N/A'}</h6>
            <div class="buttons">
              <button id="BB" class="action_button1" onclick="addGenres('${anime.mal_id}')" href="#">Add genres to search</button>
              <button id="BB2" class="action_button2" onclick="aniRecommender(${anime.mal_id}, '${anime.title}')" href="#">Recommended Titles</button>
            </div>
          </div>
        </div>
      </div>
      `;
    });
  });

  console.log(data.results);
  $('#movies').html(output);
}

function animeSelected(id) {
  sessionStorage.setItem('animeId', id);
  window.location = 'index.html';
  return false;
}



// Use stored mal_id to fetch more details to a new page
 function getAnimeDetails(){
     let malId = sessionStorage.getItem('animeId');
     fetch('https://api.jikan.moe/v4/anime/'+ malId)
       .then(res=>res.json())
         .then((response) => {
             console.log(response);
             let selected_anime = response.data;
             let genre_holder = '';

             for(let x = 0; x < selected_anime.genres.length; x++)
             {
               genre_holder += selected_anime.genres[x].name;
               if(x != selected_anime.genres.length -1)
                  {genre_holder += ', ';}
             }

             let output = `
                 <div class="row">
                     <div class="col-md-4">
                         <img src="${selected_anime.images.jpg.large_image_url}" alt="${selected_anime.Title}" id="specificPage" class="thumbnail"/>
                     </div>
                     <div class="col-md-8">
                         <ul class="list-group">
                             <li class="list-group-item"><strong>English Title:</strong> ${selected_anime.title_english}</li>
                             <li class="list-group-item"><strong>Japanese Title:</strong> ${selected_anime.title_japanese}</li>
                             <li class="list-group-item"><strong>Type:</strong> ${selected_anime.type}</li>
                             <li class="list-group-item"><strong>Number of episodes:</strong> ${selected_anime.episodes}</li>
                             <li class="list-group-item"><strong>Rated:</strong> ${selected_anime.rating}</li>
                             <li class="list-group-item"><strong>Year of release:</strong> ${selected_anime.aired.prop.from.year}</li>

                             <li class="list-group-item"><strong>User score:</strong> ${selected_anime.score}</li>
                             <li class="list-group-item"><strong>Genre:</strong> ${genre_holder}</li>
                         </ul>
                     </div>
                 </div>
                 <div class="row">
                 <div class="col-md-12">
                     <h3 id="plot">Plot</h3>
                     <div class="col-md-12 list-group-item" id="plot">
                         <p>${selected_anime.synopsis}</p>
                     </div>
                     <hr>
                     <a href="${selected_anime.url}" target="_blank" class="btn btn-primary" id="genBtn">View MAL Page</a>

                    <a href="index.html" target="_blank" class="btn btn-primary" id="genBtn">Go back to search</a>
                 </div>
                 </div>
             `;

             $('#specAnime').html(output);
         })
         .catch((err) => {
             console.log(err);
         });
 }



// REFERENCE: https://github.com/lukes-code/imdbApi