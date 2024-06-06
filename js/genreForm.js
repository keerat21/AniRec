
///////////https://www.cssscript.com/select-box-virtual-scroll/ - -- For the drop down

var genreN = {};

// making dictionary for mappig genre_IDS to genres
for(let a =0; a<50; a++)
{

  genreN[a+1] = convertMAL_IDToGenre(a+1);
}


// Filtering out the empty and unwanted genres
  for ( i = 1; i <= 50; i += 1 ) {

    if(genreN.hasOwnProperty(i) && genreN[i] != 'None')
    {
      // adding the genre options in the genre dropdown bar
      document.querySelector('#multi_option').addOption(  { label: genreN[i], value: i, alias: 'custom label for search' });
    }
  }

console.log(genreN);




var allGenres = [];

// called when genre has to be added to the drop down using the add genres button on cards; Fetch using JIKAN_V4 API
function addGenres(id)
{

  allGenres =   document.querySelector('#multi_option').value;
  fetch(`${base_url}anime/${id}`)
  .then(response=>response.json())
  .then(putGenre) //function refreshes page
  .catch(err=>console.warn(err.message));
}

function putGenre(data){
  let anime = data.data;
  let AG = anime.genres;
  const mal_genre_id = [];
  console.log('callable!!');

  for (let x = 0; x < AG.length; x++)
  {
    let G = AG[x];

    //creates an array for comparison
    mal_genre_id[x] = G.mal_id;
    if(!allGenres.includes(G.mal_id))
      allGenres.push(G.mal_id);
    //for dropdown


    genreOut += G.name +','; // we can use the other function I made to convert from MAl_IDs right to a comma separated string
    console.log('yoGGG '+G.name+' '+ G.mal_id );



  }
  if(document.querySelector('#multi_option').value == '')
  {allGenres = [];
  document.querySelector('#multi_option').setValue(mal_genre_id);
  }
else
  {
  console.log(mal_genre_id);
  document.querySelector('#multi_option').setValue(allGenres);}



  //grabs the info from the genre text box
  let temptext = document.getElementById('genreText').value;
  const genre_box_MAL_Ids = convertGenreToMAL_ID(temptext); //should return an array of IDs

//
// Insert comparison for the two arrays here
for(let i =0; i < genre_box_MAL_Ids.length; i++)
{
  let flag = false;
  for(let j =0; j < mal_genre_id.length; j++)
  {

    if(genre_box_MAL_Ids[i] == mal_genre_id[j])
    {
      flag = true;
    }

  }
  if (!flag)
  {
    mal_genre_id.push(genre_box_MAL_Ids[i]);
  }

}
mal_genre_id.sort();
genreOut = convertMAL_IDToGenre(mal_genre_id);
//
  console.log('yGchange '+genreOut);
  document.getElementById('genreText').value= genreOut;
  // $('#genreText').value = genreOut.toString();
}



// switch for mal_ID to String name; used to make the dictionary
function convertMAL_IDToGenre(input)
{
  var output = '';

    switch(input){
      case 1:
        output = "action";
        break;
      case 2:
        output = "adventure";
        break;
      case 3:
        output = "cars";
        break;
      case 4:
        output = "comedy";
        break;
      case 5:
        output = "avante garde";
        break;
      case 6:
        output = "demons";
        break;
      case 7:
        output = "mystery";
        break;
      case 8:
        output = "drama";
        break;
      case 9:
        output = "ecchi";
        break;
      case 10:
        output = "fantasy";
        break;
      case 11:
        output = "game";
        break;
      case 13:
        output = "historical";
        break;
      case 14:
        output = "horror";
        break;
      case 15:
        output = "kids";
        break;
      case 18:
        output = "mecha";
        break;
      case 17:
        output = "martial arts";
        break;

      case 19:
        output = "music";
        break;
      case 20:
        output = "parody";
        break;
      case 21:
        output = "samurai";
        break;
      case 22:
        output = "romance";
        break;
      case 23:
        output = "school";
        break;
      case 24:
        output = "sci fi";
        break;
      case 25:
        output = "shoujo";
        break;
      case 26:
        output = "girls love";
        break;
      case 27:
        output = "shounen";
        break;
      case 28:
        output = "boys love";
        break;
      case 29:
        output = "space";
        break;
      case 30:
        output = "sports";
        break;
      case 31:
        output = "super power";
        break;
      case 32:
        output = "vampire";
        break;
      case 35:
        output = "harem";
        break;
      case 36:
        output = "slice of life";
        break;

      case 37:
        output = "supernatural";
        break;
      case 38:
        output = "military";
        break;
      case 39:
        output = "police";
        break;
      case 40:
        output = "psychological";
        break;
      case 41:
        output = "suspense";
        break;
      case 42:
        output = "seinen";
        break;
      case 43:
        output = "josei";
        break;
      case 46:
        output = "award winning";
        break;
      case 47:
        output = "gourmet";
        break;
      case 48:
        output = "work life";
      default: output = "None";
        break;


    }

  return output;
  }
