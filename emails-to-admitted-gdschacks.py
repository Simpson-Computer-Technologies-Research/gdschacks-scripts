from supabase import create_client, Client, ClientOptions
import os

##
## Environment variables
##
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
opts: ClientOptions = ClientOptions(
    postgrest_client_timeout=10, storage_client_timeout=10
)
client: Client = create_client(url, key, opts)

##
## Emails to admit
##
emails_to_admit = []


##
## Main function
##
def main() -> None:
    # Get all users from the database
    response = client.table("users").select("*").execute()
    users = response.get("data")

    # For each email in emails_to_admit, set the 'isAdmitted' to True
    for user in users:
        email: str = user.get("email")

        if email in emails_to_admit:
            try:
                client.table("users").update({"isAdmitted": True}).eq(
                    "email", email
                ).execute()
            except Exception as e:
                print(f"Failed to admit {user.get('email')} | Error: {e}")
            else:
                print(f"Admitted {user.get('email')}")

    ##
    ## End of function
    ##


##
## Run the script
##
if __name__ == "__main__":
    main()
    print("Admitted all emails in emails_to_admit")

##
## End of file
##
