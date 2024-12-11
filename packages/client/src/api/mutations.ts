import { gql } from '@apollo/client';

export const MUTATION_CREATE_TASK = gql`
  mutation createTask($data: CreateTaskInput!) {
    createTask(data: $data) {
      title
      id
    }
  }
`;

export const MUTATION_GET_CUSTOMER_PORTAL_URL = gql`
  mutation {
    requestCustomerPortalUrl
  }
`;
export const MUTATION_GET_CHECKOUT_URL = gql`
  mutation requestCheckoutUrl($productId: String!) {
    requestCheckoutUrl(productId: $productId)
  }
`;

export const MUTATION_DELETE_INVITATION = gql`
  mutation deleteInvitation($id: String!) {
    deleteInvitation(invitationId: $id) {
      id
      email
    }
  }
`;

export const MUTATION_DELETE_TEAM_MEMBER = gql`
  mutation deleteTeamMember($id: String!) {
    deleteTeamMember(memberId: $id) {
      id
    }
  }
`;

export const MUTATION_DELETE_TASK = gql`
  mutation deleteTaskById($taskId: String!) {
    deleteTaskById(taskId: $taskId) {
      id
      title
    }
  }
`;

export const MUTATION_DELETE_TAG = gql`
  mutation deleteTagById($id: String!) {
    deleteTagById(id: $id) {
      id
    }
  }
`;

export const MUTATION_DELETE_ACCOUNT = gql`
  mutation deleteAccount($id: String!) {
    deleteAccount(accountId: $id) {
      id
    }
  }
`;

export const MUTATION_CREATE_TAG = gql`
  mutation createTag($name: String!) {
    createTag(name: $name) {
      name
      id
    }
  }
`;

export const BULK_DELETE_TASKS = gql`
  mutation deleteTasks($taskIds: [String!]!) {
    deleteTasks(taskIds: $taskIds)
  }
`;

export const BULK_DELETE_TAGS = gql`
  mutation deleteTags($ids: [String!]!) {
    deleteTags(tagIds: $ids)
  }
`;

export const MUTATION_TOGGLE_TASK_STATUS = gql`
  mutation toggleTaskStatus($taskId: String!) {
    toggleTaskStatus(taskId: $taskId) {
      id
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshAccessToken {
    refreshToken {
      accessToken
    }
  }
`;

export const MUTATION_INVITE_TEAM_MEMBER = gql`
  mutation inviteTeamMember($data: InviteesInput!) {
    inviteUsers(data: $data)
  }
`;

export const MUTATION_ADD_TAGS_TO_TASKS = gql`
  mutation addTagstoTasks($data: AddTagsToTasksInput!) {
    addTagstoTasks(data: $data) {
      id
      title
    }
  }
`;

export const MUTATION_UPDATE_PROFILE = gql`
  mutation updateUser($data: UpdateUserInput!) {
    updateUser(data: $data) {
      firstname
      lastname
      avatar
      email
    }
  }
`;

export const MUTATION_CHANGE_PASSWORD = gql`
  mutation changePassword($data: ChangePasswordInput!) {
    changePassword(data: $data) {
      id
    }
  }
`;

export const MUTATION_UPDATE_TASK = gql`
  mutation updateTask($data: UpdateTaskInput!) {
    updateTask(data: $data) {
      title
      id
    }
  }
`;

export const MUTATION_UPDATE_TAG = gql`
  mutation updateTag($id: String!, $name: String!) {
    updateTag(id: $id, name: $name) {
      name
      id
    }
  }
`;

export const MUTATION_SIGN_IN = gql`
  mutation signIn($data: SignInInput!) {
    signIn(data: $data) {
      accessToken
    }
  }
`;

export const MUTATION_SIGN_IN_WITH_MAGICLINK = gql`
  mutation signInWithMagicLink($data: SignInWithMagicLinkInput!) {
    signInWithMagicLink(data: $data) {
      accessToken
    }
  }
`;

export const MUTATION_REQUEST_MAGICLINK = gql`
  mutation requestMagicLink($data: RequestMagicLinkInput!) {
    requestMagicLink(data: $data)
  }
`;

export const MUTATION_SIGN_UP = gql`
  mutation signUp($data: SignUpDto!) {
    signUp(data: $data) {
      accessToken
    }
  }
`;

export const MUTATION_ACCEPT_INVITATION = gql`
  mutation acceptInvitation($data: AcceptInvitationInput!) {
    acceptInvitation(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

export const MUTATION_SEND_RESET_PASSWORD_LINK = gql`
  mutation sendResetPasswordLink($data: ForgotPasswordInput!) {
    sendResetPasswordLink(data: $data)
  }
`;

export const MUTATION_RESET_PASSWORD = gql`
  mutation resetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data) {
      id
    }
  }
`;
