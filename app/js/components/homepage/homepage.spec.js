describe('Test Suite for Homepage Controller', function () {
    var $controller, dashboardService, procedureService, userService;
    var windowMock = {
        innerWidth: ''
    };

    beforeEach(function () {
        // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);
            sideNavOpenMock = jasmine.createSpy();
            $provide.factory('$mdSidenav', function() {
                return function(sideNavId){
                    return { open: sideNavOpenMock };
                };
            });
        });

        inject(function($componentController){
            dashboardService = jasmine.createSpyObj('dashboardService', ['getLock','setRightLock']);
            procedureService = jasmine.createSpyObj('procedureService', ['setHeaderStyles', 'setProcedureName','getProcedureName','getHeaderStyles','getIconStyles']);
            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName']);
            
            userService.getUserName.and.callFake(function() {
                return 'John Smith';
            });
            userService.userRole.and.callFake(function() {
                return { cRole : { 'callsign' : 'MD'}};
            });
            dashboardService.getLock.and.callFake(function() {
                return { lockLeft : false, lockRight : false };
            });

            procedureService.getProcedureName.and.callFake(function(){
                return { id:"1.1", name:"Procedure Example",status:"Open Procedure",fullname : "Open Procedure: 1.1 - Procedure Example"}
            });

            procedureService.getHeaderStyles.and.callFake(function(){
                return { styles:{}, namestyles:{}}
            });

            procedureService.getIconStyles.and.callFake(function(){
                return { icon1style:"", icon2style:"",icon3style:"",icon4style : ""}
            });

            $controller = $componentController('homepage', {
                dashboardService: dashboardService,
                procedureService : procedureService,
                userService : userService
            });
        });

    });

    it('should define the dashboard component', function() {
        expect($controller).toBeDefined();
    });

    it('should define user name and role', function() {
        expect(userService.getUserName).toHaveBeenCalled();
        expect($controller.name).toEqual('John Smith');
        expect($controller.role).toBeDefined();
        expect($controller.role).toEqual(userService.userRole);
    });

    it('should define locks', function() {
        expect(dashboardService.getLock).toHaveBeenCalled();
        expect($controller.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define procedure,header styles and icon styles', function() {
        expect(procedureService.getProcedureName).toHaveBeenCalled();
        expect($controller.procedure).toEqual({id:"1.1", name:"Procedure Example",status:"Open Procedure",fullname : "Open Procedure: 1.1 - Procedure Example"});
        expect(procedureService.getHeaderStyles).toHaveBeenCalled();
        expect($controller.header).toEqual({  styles:{}, namestyles:{}});
        expect(procedureService.getIconStyles).toHaveBeenCalled();
        expect($controller.icons).toEqual({ icon1style:"", icon2style:"",icon3style:"",icon4style : ""});
    });

    it('should define the function openRightNav', function(){
        expect($controller.openRightNav).toBeDefined();
    });

    it('should open the right navigation menu, window width less than 800', function(){
        windowMock.innerWidth = 768;
        $controller.openRightNav();

        //expect the mocked mdSidenav open function to be called
        expect(sideNavOpenMock).toHaveBeenCalled();
    });

    it('should not open the right navigation menu, window width 800 or more', function(){
        windowMock.innerWidth = 1000;
        $controller.openRightNav();

        //expect the right lock to be false
        expect($controller.locks.lockRight).toEqual(false);
        expect(dashboardService.setRightLock).toHaveBeenCalledWith(false);
    });

    it('should define the function setColor', function(){
        expect($controller.setColor).toBeDefined();
    });

    it('should set Color of the header and update the procedure name', function(){
        windowMock.innerWidth = 1000;
        $controller.setColor();

        //expect the setHeaderStyles and setProcedureName to be called
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('block','none','#ffffff','#000000','inline-block','none',windowMock.innerWidth);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith('','',"Home");
    });

});