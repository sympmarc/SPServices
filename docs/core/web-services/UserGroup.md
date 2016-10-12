---
title: 'UserGroup'
function: '$().SPServices'
web_service: 'UserGroup (Users and Groups)'
---

## Supported Operations

**Note**: Links in the Operation column will show you more details for the operation, including examples, if available. Links in the MSDN Documentation column will take you to the SDK on MSDN for that operation.

| Operation | Options | MSDN Documentation | Introduced |
| --------- | ------- | ------------------ | ---------- |
| AddGroup | `groupName, ownerIdentifier, ownerType, defaultUserLoginName, description` | [UserGroup.AddGroup Method](http://msdn.microsoft.com/en-us/library/ms774470.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| AddGroupToRole | `roleName, groupName` | [UserGroup.AddGroupToRole Method](http://msdn.microsoft.com/en-us/library/ms772540.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| AddRole | `[webURL], roleName, description, permissionMask` | [UserGroup.AddRole Method](http://msdn.microsoft.com/en-us/library/ms772714.aspx) | [0.2.1](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| AddRoleDef | `roleName, description, permissionMask` | [UserGroup.AddRoleDef Method](http://msdn.microsoft.com/en-us/library/ms774640%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| AddUserCollectionToGroup | `groupName, usersInfoXml` | [UserGroup.AddUserCollectionToGroup Method](http://msdn.microsoft.com/en-us/library/ms774538%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| AddUserCollectionToRole | `roleName, usersInfoXml` | [UserGroup.AddUserCollectionToRole Method](http://msdn.microsoft.com/en-us/library/ms772619%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| AddUserToGroup | `groupName, userName, userLoginName, userEmail, userNotes` | [UserGroup.AddUserToGroup Method](http://msdn.microsoft.com/en-us/library/ms772683%28v=office.12%29.aspx) | [0.5.7](http://spservices.codeplex.com/releases/view/47136) |
| AddUserToRole | `roleName, userName, userLoginName, userEmail, userNotes` | [UserGroup.AddUserToRole Method](http://msdn.microsoft.com/en-us/library/ms774883%28v=office.12%29.aspx) | [0.5.7](http://spservices.codeplex.com/releases/view/47136) |
| GetAllUserCollectionFromWeb | `[webURL]` | [UserGroup.GetAllUserCollectionFromWeb Method](http://msdn.microsoft.com/en-us/library/ms772661.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetGroupCollection | `groupNamesXml` | [UserGroup.GetGroupCollection Method](http://msdn.microsoft.com/en-us/library/ms774837.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetGroupCollectionFromRole | `roleName` | [UserGroup.GetGroupCollectionFromRole Method](http://msdn.microsoft.com/en-us/library/ms774597.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetGroupCollectionFromSite | `[webURL]` | [UserGroup.GetGroupCollectionFromSite Method](http://msdn.microsoft.com/en-us/library/ms774594.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| [GetGroupCollectionFromUser](UserGroup/GetGroupCollectionFromUser.md) | `userLoginName` | [UserGroup.GetGroupCollectionFromUser Method](http://msdn.microsoft.com/en-us/library/ms772552.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetGroupCollectionFromWeb | `[webURL]` | [UserGroup.GetGroupCollectionFromWeb Method](http://msdn.microsoft.com/en-us/library/ms774815.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetGroupInfo | `groupName` | [UserGroup.GetGroupInfo Method](http://msdn.microsoft.com/en-us/library/ms774799.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetRoleCollection | `roleNamesXml` | [UserGroup.GetRoleCollection Method](http://msdn.microsoft.com/en-us/library/ms774593.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetRoleCollectionFromGroup | `groupName` | [UserGroup.GetRoleCollectionFromGroup Method](http://msdn.microsoft.com/en-us/library/ms773817%28v=office.12%29.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetRoleCollectionFromUser | `userLoginName` | [UserGroup.GetRoleCollectionFromUser Method](http://msdn.microsoft.com/en-us/library/ms772680.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetRoleCollectionFromWeb | `[webURL]` | [UserGroup.GetRoleCollectionFromWeb Method](http://msdn.microsoft.com/en-us/library/ms772673.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetRoleInfo | `roleName` | [UserGroup.GetRoleInfo Method](http://msdn.microsoft.com/en-us/library/ms774830.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| [GetRolesAndPermissionsForCurrentUser](UserGroup/GetRolesAndPermissionsForCurrentUser.md) | `[webURL]` | [UserGroup.GetRolesAndPermissionsForCurrentUser Method](http://msdn.microsoft.com/en-us/library/ms774677.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetRolesAndPermissionsForSite | `[webURL]` | [UserGroup.GetRolesAndPermissionsForSite Method](http://msdn.microsoft.com/en-us/library/ms774632.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetUserCollection | `userLoginNamesXml` | [UserGroup.GetUserCollection Method](http://msdn.microsoft.com/en-us/library/ms774455.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetUserCollectionFromGroup | `groupName` | [UserGroup.GetUserCollectionFromGroup Method](http://msdn.microsoft.com/en-us/library/ms772554.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetUserCollectionFromRole | `roleName` | [UserGroup.GetUserCollectionFromRole Method](http://msdn.microsoft.com/en-us/library/ms772672.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetUserCollectionFromSite | _None_ | [UserGroup.GetUserCollectionFromSite Method](http://msdn.microsoft.com/en-us/library/ms772702.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetUserCollectionFromWeb | `[webURL]` | [UserGroup.GetUserCollectionFromWeb Method](http://msdn.microsoft.com/en-us/library/ms774581.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| GetUserInfo | `userLoginName` | [UserGroup.GetUserInfo Method](http://msdn.microsoft.com/en-us/library/ms774637.aspx) | [0.2.3](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=31744) |
| GetUserLoginFromEmail | `emailXml` | [UserGroup.GetUserLoginFromEmail Method](http://msdn.microsoft.com/en-us/library/ms774890.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| RemoveGroup | `groupName` | [UserGroup.RemoveGroup Method](http://msdn.microsoft.com/en-us/library/ms774635.aspx) | [0.2.10](http://spservices.codeplex.com/Release/ProjectReleases.aspx?ReleaseId=32949) |
| RemoveGroupFromRole | `roleName, groupName` | [UserGroup.RemoveGroupFromRole Method](http://msdn.microsoft.com/en-us/library/ms774728%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| RemoveRole | `roleName` | [Webs.RemoveRole Method](http://msdn.microsoft.com/en-us/library/ms774731%28v=office.12%29.aspx) | [0.5.8](http://spservices.codeplex.com/releases/view/53275) |
| RemoveUserCollectionFromGroup | `groupName, userLoginNamesXml` | [UserGroup.RemoveUserCollectionFromGroup Method](http://msdn.microsoft.com/en-us/library/ms772658%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| RemoveUserCollectionFromRole | `roleName, userLoginNamesXml` | [UserGroup.RemoveUserCollectionFromRole Method](http://msdn.microsoft.com/en-us/library/ms772654%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| RemoveUserCollectionFromSite | `userLoginNamesXml` | [UserGroup.RemoveUserCollectionFromSite Method](http://msdn.microsoft.com/en-us/library/ms774433%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| RemoveUserFromGroup | `groupName, userLoginName` | [UserGroup.RemoveUserFromGroup Method](http://msdn.microsoft.com/en-us/library/ms774499%28v=office.12%29.aspx) | [0.5.7](http://spservices.codeplex.com/releases/view/47136) |
| RemoveUserFromRole | `roleName, userLoginName` | [UserGroup.RemoveUserFromRole Method](http://msdn.microsoft.com/en-us/library/ms774892%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| RemoveUserFromSite | `userLoginName` | [UserGroup.RemoveUserFromSite Method](http://msdn.microsoft.com/en-us/library/ms772644%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| RemoveUserFromWeb | `userLoginName` | [UserGroup.RemoveUserFromWeb Method](http://msdn.microsoft.com/en-us/library/ms772548%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| UpdateGroupInfo | `oldGroupName, groupName, ownerIdentifier, ownerType, description` | [UserGroup.UpdateGroupInfo Method](http://msdn.microsoft.com/en-us/library/ms774703%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| UpdateRoleDefInfo | `oldRoleName, roleName, description, permissionMask` | [UserGroup.UpdateRoleDefInfo Method](http://msdn.microsoft.com/en-us/library/ms774466%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| UpdateRoleInfo | `oldRoleName, roleName, description, permissionMask` | [UserGroup.UpdateRoleInfo Method](http://msdn.microsoft.com/en-us/library/ms774452%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
| UpdateUserInfo | `userLoginName, userName, userEmail, userNotes` | [UserGroup.UpdateUserInfo Method](http://msdn.microsoft.com/en-us/library/ms772614%28v=office.12%29.aspx) | [0.6.0](http://spservices.codeplex.com/releases/view/55660) |
