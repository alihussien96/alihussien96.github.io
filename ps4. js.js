function runExploit() {
    fetch('payload.bin')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            // Code to execute the payload
            console.log('Payload loaded:', buffer);
            // Add payload execution code here
        })
        .catch(error => console.error('Error loading payload:', error));
}


