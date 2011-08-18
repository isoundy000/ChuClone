/**
File:
	ChuCloneBaseState.js
Created By:
	Mario Gonzalez
Project	:
	ChuClone
Abstract:
 	An abstract class for the all states specific to ChuClone.
 	Contains update physics and a few properties
 Basic Usage:
 	Should not be instantiated
 License:
    Creative Commons Attribution-NonCommercial-ShareAlike
    http://creativecommons.org/licenses/by-nc-sa/3.0/
 */
(function(){
    "use strict";

	ChuClone.namespace("ChuClone.states");

	ChuClone.states.ChuCloneBaseState = function() {
		ChuClone.states.ChuCloneBaseState.superclass.constructor.call(this);
		this._gameView = null;
		this._worldController = null;
		this._levelManager = null;
	};

	ChuClone.states.ChuCloneBaseState.prototype = {
        /**
         * @type {ChuClone.GameViewController}
         */
        _gameView: null,

        /**
         * @type {ChuClone.physics.WorldController}
         */
        _worldController: null,

		 /**
         * @type {ChuClone.editor.LevelManager}
         */
        _levelManager: null,

		/**
		 * @inheritDoc
		 */
		enter: function() {

			if( !this._levelManager || !this._worldController || !this._gameView ) {
				debugger;
			}

			ChuClone.states.ChuCloneBaseState.superclass.enter.call(this);
            this.setupEvents();
		},

		/**
		 * Sets up events this state wants to listen for
		 */
        setupEvents: function() {
            console.log("setting up events")
        },

        /**
         * @inheritDoc
         */
        update: function() {
            ChuClone.states.ChuCloneBaseState.superclass.update.call(this);
        },

		/**
		 * Updates the physics simulation
		 */
		updatePhysics: function() {
			var fixedTimeStepAccumulatorRatio = this._worldController.getFixedTimestepAccumulatorRatio();

			/**
             * @type {Box2D.Dynamics.b2Body}
             */
            var node = this._worldController.getWorld().GetBodyList();
            while(node) {
                var b = node;
                node = node.GetNext();
                /**
                 * @type {ChuClone.GameEntity}
                 */
                var entity = b.GetUserData();
                if(entity)
                    entity.update( fixedTimeStepAccumulatorRatio );
            }
		},

		/**
		 * Creates a bunch of simple cube entities that can be used as background elements
		 * @param {Number} amount
		 * @param {Boolean} shouldAddToView
		 * @param {THREE.Vector3} centerPosition
		 * @param {THREE.Vector3} rangeDimensions
		 * @param {THREE.Vector3} maxDimensions
		 * @return {Array} backgroundElements An array of THREE.Mesh objects
		 */
		createBackgroundElements: function( amount, shouldAddToView, centerPosition, rangeDimensions, maxDimensions) {

			var backgroundElements = [];

			for (var j = 0; j < amount; j++) {
				var width = Math.random() * maxDimensions.x;
				var height = Math.random() * maxDimensions.y;
				var depth = Math.random() * maxDimensions.z;

				var geometry = new THREE.CubeGeometry(width, height, depth);

				var mesh = new THREE.Mesh(geometry, [new THREE.MeshLambertMaterial({
							color: 0xFFFFFF, shading: THREE.SmoothShading,
							map : THREE.ImageUtils.loadTexture(ChuClone.model.Constants.SERVER.ASSET_PREFIX + "assets/images/game/floor.png")
						})]);

				mesh.dynamic = false;
				mesh.position.x = centerPosition.x + ChuClone.utils.randFloat(-rangeDimensions.x, rangeDimensions.x);
				mesh.position.y = centerPosition.y + ChuClone.utils.randFloat(-rangeDimensions.y, rangeDimensions.y);
				mesh.position.z = centerPosition.z - ChuClone.utils.randFloat(rangeDimensions.z/2, rangeDimensions.z);

				backgroundElements.push(mesh);

				if( shouldAddToView ) {
					this._gameView.addObjectToScene(mesh);
				}
			}

			return backgroundElements;
		},

        /**
         * @inheritDoc
         */
        exit: function() {
            ChuClone.states.ChuCloneBaseState.superclass.exit.call(this);
            this.dealloc();
        },

		/**
		 * Removes an entity from the game
		 * @param entity
		 */
		remoteEntity: function( entity ) {
			var b = entity.getBody();

			if ("getView" in entity) {
				this._gameView.removeObjectFromScene(entity.getView());
			}

			if ("dealloc" in entity) {
				entity.dealloc();
			}

			this._worldController.getWorld().DestroyBody(b);
		},

        /**
         * @inheritDoc
         */
        dealloc: function() {
			this._gameView = null;
			this._worldController = null;
			this._levelManager = null;
        }
	};

    ChuClone.extend( ChuClone.states.ChuCloneBaseState, ChuClone.model.FSM.State );
})();