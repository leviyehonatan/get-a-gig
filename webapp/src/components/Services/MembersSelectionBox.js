import React, { useState } from 'react';
import { Query } from 'react-apollo';
import { Form, Header } from 'semantic-ui-react';
import gql from 'graphql-tag';

export default ({}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [members, setMembers] = useState('');
    return (
        <Query skip query={searchMembersQuery} variables={{ name: searchQuery }}>
            {({ loading: loadingMembers, error, data }) => {
                const { searchMembers } = data || {};
                return (
                    <div>
                        <Header>Members</Header>
                        <Form.Dropdown
                            label="Select Members"
                            value={members}
                            options={
                                searchMembers
                                    ? searchMembers.map(member => {
                                          return {
                                              text: member.displayName,
                                              value: member.email,
                                          };
                                      })
                                    : []
                            }
                            onChange={(e, { value }) => {
                                setMembers(value);
                            }}
                            labeled
                            search
                            loading={loadingMembers}
                            placeholder="Search for members"
                            fluid
                            allowAdditions
                            selection
                            multiple
                            onSearchChange={(e, { searchQuery }) => {
                                setSearchQuery(searchQuery);
                            }}
                        />
                    </div>
                );
            }}
        </Query>
    );
};

const searchMembersQuery = gql`
    query($name: String!) {
        searchMembers(id: $id, name: $name) {
            displayName
            email
        }
    }
`;
