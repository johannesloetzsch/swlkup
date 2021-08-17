import { useQuery, UseQueryOptions } from 'react-query';
import { fetcher } from './fetcher';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The 'Long' scalar type represents non-fractional signed whole numeric values. Long can represent values between -(2^64) and 2^64 - 1. */
  Long: any;
  /** Either a collection of ngo-ids or `any` */
  NgoRefs: any;
};

/** Authentication requires either a valid mail+password combination or a jwt obtained by an earlier login. */
export type Auth = {
  /** Self descriptive. */
  mail: Scalars['String'];
  /** Self descriptive. */
  password: Scalars['String'];
  /** Self descriptive. */
  jwt: Scalars['String'];
};

export type Contacts = {
  __typename?: 'Contacts';
  phone?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type ContactsInput = {
  phone?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
};

export type Location = {
  __typename?: 'Location';
  zip?: Maybe<Scalars['String']>;
  lon?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  radius_kilometer?: Maybe<Scalars['String']>;
  address_string?: Maybe<Scalars['String']>;
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationType = {
  __typename?: 'MutationType';
  /** Add a new supervisor account to the database and send a mail containing the password via mail */
  supervisor_register: Scalars['Boolean'];
  /** Update a supervisors data */
  supervisor_update: Scalars['Boolean'];
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationTypeSupervisor_RegisterArgs = {
  auth: Auth;
  mail: Scalars['String'];
};


/** If this server supports mutation, the type that mutation operations will be rooted at. */
export type MutationTypeSupervisor_UpdateArgs = {
  auth: Auth;
  supervisor_input: SupervisorInput;
};


/** The type that query operations will be rooted at. */
export type QueryType = {
  __typename?: 'QueryType';
  /** For a username+password get a jwt containing the login:id */
  login: Login;
  /** All supervisors visible to the ngo assiged to the token */
  lookup: Lookup;
  /** All Ngos */
  ngos: Array<Ngos>;
  /** All languages */
  languages: Array<Languages>;
  /** All offers */
  offers: Array<Offers>;
  /** For a supervisor login, get the supervisors data */
  supervisor_get?: Maybe<Supervisor_Get>;
};


/** The type that query operations will be rooted at. */
export type QueryTypeLoginArgs = {
  auth: Auth;
};


/** The type that query operations will be rooted at. */
export type QueryTypeLookupArgs = {
  token: Scalars['String'];
};


/** The type that query operations will be rooted at. */
export type QueryTypeNgosArgs = {
  auth: Auth;
};


/** The type that query operations will be rooted at. */
export type QueryTypeSupervisor_GetArgs = {
  auth: Auth;
};

/** The new Dataset of a Supervisor */
export type SupervisorInput = {
  /** Self descriptive. */
  ngos: Scalars['NgoRefs'];
  name_full?: Maybe<Scalars['String']>;
  languages: Array<Scalars['String']>;
  offers: Array<Scalars['String']>;
  /** Self descriptive. */
  contacts: ContactsInput;
  photo?: Maybe<Scalars['String']>;
  text_specialization?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** All languages */
export type Languages = {
  __typename?: 'languages';
  /** Self descriptive. */
  id: Scalars['String'];
  /** Self descriptive. */
  name: Scalars['String'];
  /** Self descriptive. */
  flag_url: Scalars['String'];
};

/** For a username+password get a jwt containing the login:id */
export type Login = {
  __typename?: 'login';
  jwt?: Maybe<Scalars['String']>;
};

/** All supervisors visible to the ngo assiged to the token */
export type Lookup = {
  __typename?: 'lookup';
  /** Self descriptive. */
  valid: Scalars['Boolean'];
  /** Self descriptive. */
  ngo?: Maybe<Ngo>;
  /** Self descriptive. */
  supervisors?: Maybe<Array<Supervisors>>;
};

/** Details of a ngo */
export type Ngo = {
  __typename?: 'ngo';
  id?: Maybe<Scalars['String']>;
  /** Self descriptive. */
  name: Scalars['String'];
};

/** All Ngos */
export type Ngos = {
  __typename?: 'ngos';
  id?: Maybe<Scalars['String']>;
  /** Self descriptive. */
  name: Scalars['String'];
};

/** All offers */
export type Offers = {
  __typename?: 'offers';
  /** Self descriptive. */
  id: Scalars['String'];
  /** Self descriptive. */
  target: Scalars['String'];
  /** Self descriptive. */
  desc: Scalars['String'];
};

/** For a supervisor login, get the supervisors data */
export type Supervisor_Get = {
  __typename?: 'supervisor_get';
  /** Self descriptive. */
  id: Scalars['String'];
  /** Self descriptive. */
  ngos: Scalars['NgoRefs'];
  name_full?: Maybe<Scalars['String']>;
  languages: Array<Scalars['String']>;
  offers: Array<Scalars['String']>;
  /** Self descriptive. */
  contacts: Contacts;
  /** Self descriptive. */
  location: Location;
  photo?: Maybe<Scalars['String']>;
  text_specialization?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

/** All supervisor visible with the used credentials */
export type Supervisors = {
  __typename?: 'supervisors';
  /** Self descriptive. */
  id: Scalars['String'];
  /** Self descriptive. */
  ngos: Scalars['NgoRefs'];
  name_full?: Maybe<Scalars['String']>;
  languages: Array<Scalars['String']>;
  offers: Array<Scalars['String']>;
  /** Self descriptive. */
  contacts: Contacts;
  /** Self descriptive. */
  location: Location;
  photo?: Maybe<Scalars['String']>;
  text_specialization?: Maybe<Scalars['String']>;
  text?: Maybe<Scalars['String']>;
};

export type LookupQueryVariables = Exact<{
  token?: Maybe<Scalars['String']>;
}>;


export type LookupQuery = (
  { __typename?: 'QueryType' }
  & { lookup: (
    { __typename?: 'lookup' }
    & Pick<Lookup, 'valid'>
    & { ngo?: Maybe<(
      { __typename?: 'ngo' }
      & Pick<Ngo, 'name'>
    )>, supervisors?: Maybe<Array<(
      { __typename?: 'supervisors' }
      & Pick<Supervisors, 'id' | 'name_full' | 'photo' | 'languages' | 'offers' | 'text'>
      & { contacts: (
        { __typename?: 'Contacts' }
        & Pick<Contacts, 'phone' | 'email' | 'website'>
      ) }
    )>> }
  ), languages: Array<(
    { __typename?: 'languages' }
    & Pick<Languages, 'id' | 'name' | 'flag_url'>
  )>, offers: Array<(
    { __typename?: 'offers' }
    & Pick<Offers, 'id' | 'target' | 'desc'>
  )> }
);

export type LoginQueryVariables = Exact<{
  auth: Auth;
}>;


export type LoginQuery = (
  { __typename?: 'QueryType' }
  & { login: (
    { __typename?: 'login' }
    & Pick<Login, 'jwt'>
  ) }
);

export type SupervisorGetQueryVariables = Exact<{
  auth: Auth;
}>;


export type SupervisorGetQuery = (
  { __typename?: 'QueryType' }
  & { supervisor_get?: Maybe<(
    { __typename?: 'supervisor_get' }
    & Pick<Supervisor_Get, 'id' | 'ngos' | 'name_full' | 'languages' | 'offers' | 'photo' | 'text_specialization' | 'text'>
    & { contacts: (
      { __typename?: 'Contacts' }
      & Pick<Contacts, 'phone' | 'website' | 'email'>
    ), location: (
      { __typename?: 'Location' }
      & Pick<Location, 'zip'>
    ) }
  )>, languages: Array<(
    { __typename?: 'languages' }
    & Pick<Languages, 'id' | 'name' | 'flag_url'>
  )>, offers: Array<(
    { __typename?: 'offers' }
    & Pick<Offers, 'id' | 'target' | 'desc'>
  )>, ngos: Array<(
    { __typename?: 'ngos' }
    & Pick<Ngos, 'id' | 'name'>
  )> }
);


export const LookupDocument = `
    query Lookup($token: String = "R4nd0m") {
  lookup(token: $token) {
    valid
    ngo {
      name
    }
    supervisors {
      id
      name_full
      photo
      languages
      offers
      contacts {
        phone
        email
        website
      }
      text
    }
  }
  languages {
    id
    name
    flag_url
  }
  offers {
    id
    target
    desc
  }
}
    `;
export const useLookupQuery = <
      TData = LookupQuery,
      TError = unknown
    >(
      variables?: LookupQueryVariables, 
      options?: UseQueryOptions<LookupQuery, TError, TData>
    ) => 
    useQuery<LookupQuery, TError, TData>(
      ['Lookup', variables],
      fetcher<LookupQuery, LookupQueryVariables>(LookupDocument, variables),
      options
    );
export const LoginDocument = `
    query Login($auth: Auth!) {
  login(auth: $auth) {
    jwt
  }
}
    `;
export const useLoginQuery = <
      TData = LoginQuery,
      TError = unknown
    >(
      variables: LoginQueryVariables, 
      options?: UseQueryOptions<LoginQuery, TError, TData>
    ) => 
    useQuery<LoginQuery, TError, TData>(
      ['Login', variables],
      fetcher<LoginQuery, LoginQueryVariables>(LoginDocument, variables),
      options
    );
export const SupervisorGetDocument = `
    query SupervisorGet($auth: Auth!) {
  supervisor_get(auth: $auth) {
    id
    ngos
    name_full
    languages
    offers
    contacts {
      phone
      website
      email
    }
    location {
      zip
    }
    photo
    text_specialization
    text
  }
  languages {
    id
    name
    flag_url
  }
  offers {
    id
    target
    desc
  }
  ngos(auth: $auth) {
    id
    name
  }
}
    `;
export const useSupervisorGetQuery = <
      TData = SupervisorGetQuery,
      TError = unknown
    >(
      variables: SupervisorGetQueryVariables, 
      options?: UseQueryOptions<SupervisorGetQuery, TError, TData>
    ) => 
    useQuery<SupervisorGetQuery, TError, TData>(
      ['SupervisorGet', variables],
      fetcher<SupervisorGetQuery, SupervisorGetQueryVariables>(SupervisorGetDocument, variables),
      options
    );