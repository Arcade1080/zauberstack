import { gql } from '@apollo/client';

export const QUERY_GET_HOME_PAGE_DATA = gql`
  query getHomepageStats {
    openTasks: getTasks(status: "open") {
      totalCount
    }
    doneTasks: getTasks(status: "done") {
      totalCount
    }
    totalTasks: getTasks {
      totalCount
    }
    totalTags: getTags {
      totalCount
    }
    totalUsers: getMembers(first: 100) {
      id
    }
    newestTeamMembers: getMembers(first: 5) {
      firstname
      lastname
      email
      avatar
      role {
        name
      }
    }
    pendingInvitations: getInvitations {
      email
      role
    }

    getActivity: getTasks(
      first: 10
      orderBy: { direction: asc, field: createdAt }
    ) {
      edges {
        node {
          title
          id
          createdBy {
            firstname
            lastname
            avatar
          }
          createdAt
        }
      }
    }
  }
`;

export const QUERY_GET_ME = gql`
  query getMe {
    me {
      id
      firstname
      lastname
      email
      avatar
      plan
      role {
        name
        permissions {
          name
        }
      }
      account {
        id
      }
    }
  }
`;

export const QUERY_GET_TASKS = gql`
  query getTasks(
    $first: Int
    $last: Int
    $tags: [String!]
    $skip: Int
    $after: String
    $before: String
    $status: String
    $query: String
    $orderBy: TaskOrder
  ) {
    getTasks(
      query: $query
      status: $status
      after: $after
      tags: $tags
      last: $last
      skip: $skip
      first: $first
      before: $before
      orderBy: $orderBy
    ) {
      edges {
        node {
          id
          title
          description
          createdAt
          createdBy {
            firstname
            lastname
            avatar
            email
          }
          status
          tags {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const QUERY_TEAM_MEMBERS_AND_INVITATIONS = gql`
  query {
    getInvitations {
      id
      email
      role
      createdAt
    }
    getMembers {
      id
      email
      firstname
      lastname
      isAccountOwner
      avatar
      createdAt
      role {
        name
      }
    }
  }
`;
export const QUERY_GET_TAGS = gql`
  query getTags($onlyInUse: Boolean) {
    getTags(onlyInUse: $onlyInUse) {
      edges {
        node {
          name
          slug
          id
        }
      }
    }
  }
`;

export const QUERY_GET_TAG_DETAIL = gql`
  query ($id: String!) {
    tag(id: $id) {
      name
      id
    }
  }
`;

export const QUERY_GET_TAGS_LIST = gql`
  query getTags(
    $first: Int
    $last: Int
    $skip: Int
    $onlyInUse: Boolean
    $after: String
    $before: String
    $query: String
    $orderBy: TagOrder
  ) {
    getTags(
      onlyInUse: $onlyInUse
      query: $query
      after: $after
      last: $last
      skip: $skip
      first: $first
      before: $before
      orderBy: $orderBy
    ) {
      edges {
        node {
          name
          slug
          id
          createdAt
          tasks {
            id
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const QUERY_GET_ACTIVE_SUBSCRIPTION_AND_AVAILABLE_PLANS = gql`
  query {
    getActiveSubscription {
      stripeCurrentPeriodStart
      stripeCurrentPeriodEnd
      stripeCancelAtPeriodEnd
      stripeCancelAt
      stripeCanceledAt
      stripeProductId
      plan
    }
    getAvailablePlans {
      productName
      productId
      planId
      price
      currency
      interval
    }
  }
`;

export const QUERY_GET_TASK_DETAIL = gql`
  query getTaskById($taskId: String!) {
    getTaskById(taskId: $taskId) {
      title
      id
      description
      tags {
        id
        name
      }
    }
  }
`;

export const QUERY_GET_TODO_DETAIL_WITH_AVAILABLE_TAGS = gql`
  query ($id: String!) {
    campaign(campaignId: $id) {
      title
      id
      description
      tags {
        id
        name
      }
    }
    tags {
      name
      slug
      id
    }
  }
`;
