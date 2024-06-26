async function runExploit() {
    try {
        document.getElementById('status').innerText = 'Discovering PS4...';
        const ps4Ip = await discoverPS4();
        if (!ps4Ip) {
            alert('PS4 not found on the network.');
            return;
        }

        document.getElementById('status').innerText = `PS4 found at ${ps4Ip}. Sending payloads...`;

        const primaryPayload = await fetchPayload('payload.bin');
        const stage2Payload = await fetchPayload('stage2_11.00.bin');

        await sendPayload(ps4Ip, primaryPayload);
        console.log('Primary payload sent successfully');

        await sendPayload(ps4Ip, stage2Payload);
        console.log('Stage 2 payload sent successfully');

        document.getElementById('status').innerText = 'Payloads sent successfully. Check your PS4.';
    } catch (error) {
        console.error('Error running exploit:', error);
        document.getElementById('status').innerText = `Error: ${error.message}`;
    }
}

async function fetchPayload(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return new Uint8Array(await response.arrayBuffer());
}

async function sendPayload(ps4Ip, payload) {
    const endpoint = `http://${ps4Ip}:9020/exploit`; // Replace with the correct endpoint
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: payload
    });
    if (!response.ok) {
        throw new Error(`Failed to send payload to ${endpoint}: ${response.statusText}`);
    }
}

async function discoverPS4() {
    const subnet = '192.168.1.'; // Adjust this based on your network
    const port = 9020; // The port your PS4 listens to
    for (let i = 1; i < 255; i++) {
        const ip = `${subnet}${i}`;
        try {
            const response = await fetch(`http://${ip}:${port}/discover`, { method: 'GET', mode: 'no-cors' });
            if (response.ok) {
                console.log(`PS4 found at ${ip}`);
                return ip;
            }
        } catch (error) {
            // Ignore errors, just continue scanning
        }
    }
    return null;
}


