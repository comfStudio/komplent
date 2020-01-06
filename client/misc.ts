let window_object_reference = null;
let previous_url = null;

export const oauth_window = (url, name, receiveMessage) => {
    // remove any existing event listeners
    window.removeEventListener('message', receiveMessage);
 
    // window features
    const strWindowFeatures =
      'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
 
    if (window_object_reference === null || window_object_reference.closed) {
      /* if the pointer to the window object in memory does not exist
       or if such pointer exists but the window was closed */
      window_object_reference = window.open(url, name, strWindowFeatures);
    } else if (previous_url !== url) {
      /* if the resource to load is different,
       then we load it in the already opened secondary window and then
       we bring such window back on top/in front of its parent window. */
      window_object_reference = window.open(url, name, strWindowFeatures);
      window_object_reference.focus();
    } else {
      /* else the window reference must exist and the window
       is not closed; therefore, we can bring it back on top of any other
       window with the focus() method. There would be no need to re-create
       the window or to reload the referenced resource. */
      window_object_reference.focus();
    }
 
    // add the listener for receiving a message from the popup
    window.addEventListener('message', event => receiveMessage(event), false);
    // assign the previous URL
    previous_url = url;
  };