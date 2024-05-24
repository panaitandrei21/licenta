import requests

def check_git_exposure(base_url):
    # Common paths in a Git repository
    paths = [
        '.git/config',
        '.git/HEAD',
        '.git/index',
        '.git/logs/HEAD',
        '.git/refs/heads/master',
        '.git/objects/'
    ]

    found_paths = []

    for path in paths:
        url = f"{base_url}/{path}"
        response = requests.get(url)
        if response.status_code == 200:
            found_paths.append(url)
            print(f"Found: {url}")
        else:
            print(f"Not Found: {url}")

    return found_paths

if __name__ == "__main__":
    # Update the base_url as per your target
    base_url = 'http://localhost:8080'
    found_items = check_git_exposure(base_url)
    if found_items:
        print("Exposed Git directories/files:")
        for item in found_items:
            print(item)
    else:
        print("No exposed Git directories/files found.")

