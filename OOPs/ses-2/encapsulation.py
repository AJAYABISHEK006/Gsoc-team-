class SecureUser:
    def __init__(self, password):
        self._password = password

    def check_password(self, password):
        return self._password == password


user = SecureUser("1234")

print(user.check_password("1234"))
print(user.check_password("5678"))

