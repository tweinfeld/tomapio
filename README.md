# tomapio
Map-User interaction logger

## What is it?

Tomapio is a user-interaction event tracker for use in conjunction with your application's geographical maps or charts. Tomapio normalizes events from multiple Map vendors, as well as from standard DOM and allows for custom plugins to be added.

Tomapio provides the following events "out of the box":

  * `map_move` [rect]
  * `map_zoom` [level]
  * `mouse_over` [position]
  * `mouse_out` [position]
  * `mouse_click` [button, position]
  * `mouse_move` [position]

## How do I use it?

  1. Initialize your map (in this case Google Maps)

    ```javascript
      var map = new google.maps.Map(document.getElementById('map'), {
              center: new google.maps.LatLng(32.0879321, 34.797246),
              zoom: 10,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              disableDefaultUI: true
      });
    ```
  2. Start Tomapio's tracker
    
    ```javascript
      var tracker = new tomapio.Tomapio({
          id: "ABCDE",
          map: map
      }, console.log.bind(console));
    ```
    Where:
    
    * `id` - Tomapio supports tracking of multiple maps concurrently. Events triggered from Tomapio will be sent along with `id` as the identifier of their source.
    * `map` - The map instance to track    
    


