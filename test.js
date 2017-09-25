const Sinon = require('sinon');
const Chai = require('chai');
Chai.use(require('sinon-chai'));
Chai.should();

const AJ = require('.');

const fakeTopic = {
    join: () => Promise.resolve(),
    part: () => Promise.resolve()
};

const fakeForum = {
    Topic: {
        getByName: () => fakeTopic
    }
};

describe('Autojoin', () => {
    before(() => Sinon.spy(fakeForum.Topic, 'getByName'));
    
    it('should be a factory', () => AJ.should.be.a('function'));
    it('should return an object', () => AJ(fakeForum, {}).should.be.an('object'));
    
    
    describe('configuration', () => {
        const config1 = {
            'channels': ['#lala', '#gaga']
        };
        
        it('should accept a config', () => AJ(fakeForum, config1).cfg.should.deep.equal(config1));
        it('should have a default config', () => AJ(fakeForum, {}).cfg.should.deep.equal({
            'channels': []
        }));
    });
    
    describe('activate', () => {
        
        before(() => {
            Sinon.spy(fakeTopic, 'join');
        });
        
        afterEach(() => {
            fakeTopic.join.reset();
            fakeForum.Topic.getByName.reset();
        });
        
        it('should join chans', () => AJ(fakeForum, {
            'channels': ['#123']
        }).activate().then(() => {
            fakeForum.Topic.getByName.should.have.been.calledWith('#123');
            fakeTopic.join.should.have.been.called;
        }));
        
        it('should join multiple chans', () => AJ(fakeForum, {
            'channels': ['#123', '#abc', '#easy']
        }).activate().then(() => {
            fakeForum.Topic.getByName.should.have.been.calledWith('#123');
            fakeForum.Topic.getByName.should.have.been.calledWith('#abc');
            fakeForum.Topic.getByName.should.have.been.calledWith('#easy');
            fakeTopic.join.should.have.been.called;
        }));
    });
    
    describe('deactivate', () => {
        
        before(() => {
            Sinon.spy(fakeTopic, 'part');
        });
        
        afterEach(() => {
            fakeTopic.part.reset();
            fakeForum.Topic.getByName.reset();
        });
        
        it('should part chans', () => AJ(fakeForum, {
            'channels': ['#123']
        }).deactivate().then(() => {
            fakeForum.Topic.getByName.should.have.been.calledWith('#123');
            fakeTopic.part.should.have.been.called;
        }));
        
        it('should part multiple chans', () => AJ(fakeForum, {
            'channels': ['#123', '#abc', '#easy']
        }).deactivate().then(() => {
            fakeForum.Topic.getByName.should.have.been.calledWith('#123');
            fakeForum.Topic.getByName.should.have.been.calledWith('#abc');
            fakeForum.Topic.getByName.should.have.been.calledWith('#easy');
        }));
    });
});