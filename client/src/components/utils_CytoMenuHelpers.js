const cytoMenuHelpers = {

    /**
    * handle activity update (name, markings, tenant(s))
    */
    updActivity: function () {

        if (this.state.elemClicked.classes.has('choreography')) {
            alert('choreography task - negociation stage to implement')
        }
        else {
            var id = this.state.elemClicked.id;


            console.log('updating activity ' + id);

            /// Marking

            this.cy.getElementById(this.state.elemClicked.id).removeClass('included');
            this.cy.getElementById(this.state.elemClicked.id).removeClass('executed');
            this.cy.getElementById(this.state.elemClicked.id).removeClass('pending');

            if (this.state.markings.executed === 1) {
                this.cy.getElementById(this.state.elemClicked.id).addClass('executed');
            }
            if (this.state.markings.included === 1) {
                this.cy.getElementById(this.state.elemClicked.id).addClass('included executable');
            }
            if (this.state.markings.pending === 1) {
                this.cy.getElementById(this.state.elemClicked.id).addClass('pending executable');
            }

            /// Name
            if (this.state.elemClicked.classes.has("choreography")) {
                this.cy.getElementById(this.state.elemClicked.id).data('name', this.state.choreographyNames.sender + ' ' + this.state.elemClicked.activityName + ' ' + this.state.choreographyNames.receiver);
            }
            else {

                this.cy.getElementById(this.state.elemClicked.id).data('name', this.state.elemClicked.activityName);
            }

        }
    },

    /**
    * remove event or relation
    */
    remove: function () {
        // watch out node or edge

        var id = this.state.elemClicked.id;

        switch (this.state.elemClicked.type) {
            case 'nodes':
                if (this.state.elemClicked.classes.has('choreography')) {
                    alert('choreography task - negociation stage to implement')
                }
                else {

                    console.log('removing node with id ' + id);
                    var j = this.cy.getElementById(id);

                    this.setState({
                        numSelected: this.state.numSelected - 1
                    });
                    this.cy.remove(j);

                }

                break;

            case 'edges':
                console.log('removing edge with id ' + id);
                var j = this.cy.getElementById(id);
                this.cy.remove(j);
                break;

            default:
                console.log('remove type error');
        };

    },


    //////// ADD ACTIVITY ///////////////

    /**
    * add local event
    */
    addLocalActivity: function () {
        console.log('add local activity');

        var label = 'NewActivity' + this.state.newActivityCnt;
        this.cy.add({
            group: 'nodes',
            data: {
                id: label,
                name: label
            },
            classes: "subgraph"
        });

        this.setState({
            newActivityCnt: this.state.newActivityCnt + 1
        });
    },

    /**
    * add choreography event
    */
    addChoreoActivity: function () {

        alert('choreography task - negociation stage to implement');

        if (false) {
            console.log('add choreography activity');

            var label = 'NewActivity' + this.state.newActivityCnt;

            this.cy.add({
                group: 'nodes',
                data: {
                    id: label,
                    name: this.state.choreographyNames.sender + "\n" + label + "\n" + this.state.choreographyNames.receiver
                },
                classes: "subgraph choreography"
            });

            this.setState({
                newActivityCnt: this.state.newActivityCnt + 1
            });
        }

    },



    /////// ADD RELATION ////////////

    /**
    * protocol to add new relation
    * @param type: relation type ('condition','milesone','response','include','exclude')
    */
    addRelation(type) {

        // CHECK TYPE OF SOURCE AND TARGET: 

        if ((this.state.source.type == 'subgraph') && (this.state.target.type == 'subgraph')) {
            // TWO SUBGRAPHS: OPERATIONS OK
            console.log('add relation ' + type);
            console.log('source ' + this.state.source.ID + ' ' + this.state.source.type);
            console.log('target ' + this.state.target.ID + ' ' + this.state.target.type);

            this.cy.add({
                group: 'edges',
                data: {
                    id: this.state.source.ID + '_' + this.state.target.ID + '_' + type,
                    source: this.state.source.ID,
                    target: this.state.target.ID
                },
                classes: type,
            });
        }

        else {
            // INSPECT CONDITIONS.
            switch (type) {
                case 'include':
                case 'exclude':
                    if (this.state.target.type == 'subgraph') {
                        console.log('add relation ' + type);
                        console.log('source ' + this.state.source.ID + ' ' + this.state.source.type);
                        console.log('target ' + this.state.target.ID + ' ' + this.state.target.type);

                        this.cy.add({
                            group: 'edges',
                            data: {
                                id: this.state.source.ID + '_' + this.state.target.ID + '_' + type,
                                source: this.state.source.ID,
                                target: this.state.target.ID
                            },
                            classes: type,
                        });
                    }
                    else {
                        alert('no disallowed behavior: cannot include / exclude element of the original graph');
                    }
                    break;

                default: // condition / response / milestone
                    console.log('add relation ' + type);
                    console.log('source ' + this.state.source.ID + ' ' + this.state.source.type);
                    console.log('target ' + this.state.target.ID + ' ' + this.state.target.type);

                    this.cy.add({
                        group: 'edges',
                        data: {
                            id: this.state.source.ID + '_' + this.state.target.ID + '_' + type,
                            source: this.state.source.ID,
                            target: this.state.target.ID
                        },
                        classes: type,
                    });

            }
        }

        // unselect all        
        var src = this.cy.getElementById(this.state.source.ID);
        var tgt = this.cy.getElementById(this.state.target.ID);

        src.removeClass('selected');
        tgt.removeClass('selected');

        this.setState({
            numSelected: this.state.numSelected - 2
        })

    },

    /**
    * add condition relation
    */
    addCondition: function () {
        this.addRelation('condition');
    },

    /**
    * add milestone relation
    */
    addMilestone: function () {
        this.addRelation('milestone');
    },

    /**
    * add response relation
    */
    addResponse: function () {
        this.addRelation('response');
    },

    /**
    * add include relation
    */
    addInclude: function () {
        this.addRelation('include');
    },

    /**
    * add exclude relation
    */
    addExclude: function () {
        this.addRelation('exclude');
    }


}

export default cytoMenuHelpers;


