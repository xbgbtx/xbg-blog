const marker_data_url="data/artist_locations"

const attribution_str = 
    "&copy; <a href=\"https://openstreetmap.org/copyright\">"         +
                        "OpenStreetMap contributors</a> | "           +
    "<a href=\"https://www.wikidata.org\" >Wikidata</a> | "           +
    "<a href=\"https://github.com/xbgbtx/ArtistMap\" >Source Code</a>";


//ID of location currently being displayed
let active_loc = null;

async function page_loaded ()
{
    console.log ( "Artist Map starting..." );

    let map = create_map ();

    await add_locations ( map );
}

function create_map ()
{
    let map = L.map ("mapdiv").setView ( [0, 0], 2 );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
    {
        maxZoom: 19,
        attribution: attribution_str,
        continuousWorld: false,
        noWrap: false
    }).addTo(map);

    return map;
}

async function add_locations ( map )
{
    let locs = await get_marker_data ( "locations" );
    let marker_cluster = L.markerClusterGroup (
    {
        chunkedLoading: true,
        iconCreateFunction: ( c ) => marker_cluster_icon ( c )
    });


    let markers = locs.map ( loc => 
    {
        let latlng = L.latLng(loc.lat, loc.lon);
        let m = L.marker(latlng,
        {
            title : `${loc.artist_count} artists`
        })
        .on ( "click", () => open_info_popup (map,loc,latlng) );
        m["artist_count"] = parseInt(loc.artist_count);

        return m;
    });

    marker_cluster.addLayers ( markers );
    map.addLayer ( marker_cluster );
}

function marker_cluster_icon ( cluster )
{
    let artist_count = cluster.getAllChildMarkers ().reduce (
        ( total, m ) => total + m.artist_count, 0
    );
    
    //let log_count = Math.log(artist_count);
    let log_count = Math.log ( artist_count ) / Math.log ( 12 );

    let size = 30;
    let size_class = "marker-cluster-";

    switch ( Math.round ( log_count ) )
    {
        case  0 : 
            size_class += "x-small"; 
            size = 30;
            break;
        case  1 : 
            size_class += "small"; 
            size = 30;
            break;
        case  2 : 
            size_class += "medium"; 
            size = 50;
            break;
        case  3 : 
            size_class += "large"; 
            size = 70;
            break;
        default : 
            size_class += "x-large"
            size = 90;
    }


    return L.divIcon(
    { 
        html: `<div><span>${artist_count}</span></div>` ,
        iconSize: L.Point(size,size),
        className: `marker-cluster ${size_class}`
    });
}

function open_info_popup ( map, loc, latlng )
{
    map.flyTo(latlng, Math.max(map.getZoom(), 12));

    let info_div = document.createElement ( "div" );
    info_div.classList.add ( "info_popup" );

    let popup = L.popup(
    {
        minWidth : 250,
        maxHeight : 200
    })
        .setLatLng(latlng)
        .setContent(info_div)
        .openOn(map);
    populate_info_div ( loc.location, info_div );
}

async function populate_info_div ( loc_id, info_div )
{
    //store loc in global to enable breaking out of loop if user
    //clicks new location
    active_loc = loc_id;

    info_div.innerHTML = "";

    let loc_header = await wiki_data_html ( loc_id );
    loc_header.classList.add ( "header" );
    info_div.appendChild ( loc_header );

    let artist_div = document.createElement ( "div" );
    artist_div.classList.add ( "scroll" );

    info_div.appendChild ( artist_div );

    let loc_artists = await get_marker_data ( loc_id );

    if ( loc_artists == null || loc_artists.length < 1 )
        return;

    for ( const b of loc_artists )
    {
        if ( active_loc != loc_id )
            break;

        let artist_info = await wiki_data_html ( b.artist );
        artist_info.classList.add ( "artist_info" );
        artist_div.appendChild ( artist_info );
    }
}

async function wiki_data_html ( id ) 
{
    let data = await get_wd_data ( id );

    let div = document.createElement ( "div" );

    let img = document.createElement ( "img" );
    img.src = "assets/music_note.png";
    //div.appendChild ( img );

    if ( data == null || data.items == null || data.items.length < 1 )
    {
        let el = document.createElement ( "a" );
        el.href = `https://www.wikidata.org/wiki/${id}`;
        el.text = id;
        div.appendChild ( el );
        return div;
    }

    data = data.items [ 0 ];
    data.img = null;

    if ( data.img != null )
        img.src = data.img.value;


    let article_a = document.createElement ( "a" );

    if ( data.article != null )
    {
        article_a.href = data.article.value;
        article_a.text = data.name.value;
    }
    else
    {
        article_a.href = `https://www.wikidata.org/wiki/${id}`;
        article_a.text = id;
    }

    div.appendChild ( article_a );

    return div;
}

async function get_marker_data ( id )
{
    let response = await fetch(`${marker_data_url}/${id}.csv`);
    let text = await response.text ();
    let lines = text.split ( "\r\n" );

    headers = lines [ 0 ].split(",");

    data = lines.slice ( 1 ).map ( ( line, idx ) =>
    {
        item = {};
        fields = line.split(",");

        if ( line.length < 1 || fields.length != headers.length )
            return null;

        fields.forEach ( ( f, idx ) => item [ headers[idx] ] = f );
        return item;
    });

    data = data.filter ( x => x !== null );

    return data;
}
