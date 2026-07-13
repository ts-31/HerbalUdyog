from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Read-only access for any request (authenticated or not).
    Write access only for users with the 'admin' role.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )
