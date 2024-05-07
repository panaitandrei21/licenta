#!/usr/bin/env python3
# Script to f3tch t3h fl4gz0rx

import os
import base64
import json
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import scrypt

# Constants
AES_BLOCK_SIZE = 32  # Used for key derivation
AES_KEY_SIZE = 32    # 256-bit key for AES

def get_aes_key(shared_num, salt):
    bnum = shared_num.to_bytes((shared_num.bit_length() + 7) // 8, byteorder='big')
    # Derive AES key from shared number and salt using scrypt
    key = scrypt(bnum, salt, AES_KEY_SIZE, N=2**14, r=8, p=1)
    return key

def decrypt_aes(msg, key):
    # Initialize AES cipher in ECB mode for decryption
    cipher = AES.new(key, AES.MODE_ECB)
    # Decrypt the message
    decrypted_data = cipher.decrypt(msg)
    return decrypted_data

if __name__ == "__main__":
    # Placeholder for actual shared secret and encrypted message
    shared_secret = 79592994760969485027766198826274613988546759904759042491305229646350447090020
    encoded_data = 'eyJtc2ciOiAiWlpQZjNOUUlCdlM4Vmh0MUpnVlZscWFRdFJuVTdxV2ErdThTbUNVWGoyTUxXUlR3OU5FdzFsMU1GL08ra0xkN0NHUjE5cU5VYlZwSlxuTTZHa2JmYzdLUT09XG4iLCAic2FsdCI6ICJId083ZDc4QnE4eGVWRTBUVjFxRjlBPT1cbiJ9'

    # Decode the base64 encoded data to get the encrypted message and salt
    decoded_data = base64.b64decode(encoded_data).decode('utf-8')
    data = json.loads(decoded_data)
    encrypted_message = base64.b64decode(data['msg'])
    salt = base64.b64decode(data['salt'])

    # Derive AES key from the shared secret and salt
    aes_key = get_aes_key(shared_secret, salt)

    # Decrypt the encrypted message using the derived AES key
    try:
        decrypted_message = decrypt_aes(encrypted_message, aes_key)
        # Assuming the decrypted message is a UTF-8 encoded string
        print("[+] Decrypted message:", decrypted_message.decode('utf-8'))
    except Exception as e:
        print("[-] Unable to decrypt the message:", e)
