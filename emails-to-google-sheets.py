from supabase import create_client, Client, ClientOptions
import os, csv

##
## Environment variables
##
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

##
## Database
##
opts: ClientOptions = ClientOptions(
    postgrest_client_timeout=10, storage_client_timeout=10
)
client: Client = create_client(url, key, opts)

##
## CSV
##
csv_writer = csv.writer(open("admitted.csv", "r"))


##
## Main function
##
def main() -> None:
    # Get all users from the database
    response = client.table("users").select("*").execute()
    users = response.get("data")

    # Iterate over the users and if they are 'isAdmitted', append them to the csv file
    for user in users:
        name: str = user.get("name")
        email: str = user.get("email")
        isAdmitted: bool = user.get("isAdmitted")

        if isAdmitted:
            csv_writer.writerow([name, email])

    ##
    ## End of function
    ##


##
## Run the script
##
if __name__ == "__main__":
    main()
    print("Admitted all emails to csv")

##
## End of file
##
