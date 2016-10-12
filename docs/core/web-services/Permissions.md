---
title: 'Permissions'
function: '$().SPServices'
web_service: 'Permissions'
---

## Supported Operations

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| AddPermission | `objectName, objectType, permissionIdentifier, permissionType, permissionMask` | [Permissions.AddPermission Method](http://msdn.microsoft.com/en-us/library/permissions.permissions.addpermission.aspx) | [0.5.2](http://spservices.codeplex.com/releases/view/40577) |
| AddPermissionCollection | `objectName, objectType, permissionsInfoXml` | [Permissions.AddPermissionCollection Method](http://msdn.microsoft.com/en-us/library/permissions.permissions.addpermissioncollection.aspx) | [0.5.2](http://spservices.codeplex.com/releases/view/40577) |
| GetPermissionCollection | `objectName, ObjectType` | [Permissions.GetPermissionCollection Method](http://msdn.microsoft.com/en-us/library/permissions.permissions.getpermissioncollection.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |
| RemovePermission | `objectName, objectType, permissionIdentifier, permissionType` | [Permissions.RemovePermission Method](http://msdn.microsoft.com/en-us/library/permissions.permissions.removepermission.aspx) | [0.5.2](http://spservices.codeplex.com/releases/view/40577) |
| RemovePermissionCollection | `objectName, objectType, memberIdsXml` | [Permissions.RemovePermissionCollection Method](http://msdn.microsoft.com/en-us/library/permissions.permissions.removepermissioncollection.aspx) | [0.5.2](http://spservices.codeplex.com/releases/view/40577) |
| UpdatePermission | `objectName, objectType, permissionIdentifier, permissionType, permissionMask` | [Permissions.UpdatePermission Method](http://msdn.microsoft.com/en-us/library/permissions.permissions.updatepermission.aspx) | [0.5.2](http://spservices.codeplex.com/releases/view/40577) |
